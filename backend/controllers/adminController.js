// backend/controllers/adminController.js
const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

// ========== USER MANAGEMENT ==========

// Get all users with filters
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isApproved,
      isBlocked,
      search
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });

  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get pending approvals (alumni/faculty)
exports.getPendingApprovals = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['alumni', 'faculty'] },
      isApproved: false,
      emailVerified: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      total: users.length
    });

  } catch (err) {
    console.error('Get pending approvals error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals'
    });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        error: 'User already approved'
      });
    }

    user.isApproved = true;
    await user.save();

    // Send notification
    await notificationService.notifyAccountApproved(user._id, user.role);

    res.json({
      success: true,
      message: 'User approved successfully'
    });

  } catch (err) {
    console.error('Approve user error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to approve user'
    });
  }
};

// Reject user
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Send rejection notification
    await notificationService.createNotification({
      userId: user._id,
      type: 'account_rejected',
      title: 'Account Rejected',
      message: reason || 'Your account application has been rejected',
      priority: 'high',
      channels: { inApp: true, email: true }
    });

    // Option 1: Delete user
    // await User.findByIdAndDelete(id);

    // Option 2: Mark as rejected (keeping data)
    user.isApproved = false;
    user.isBlocked = true;
    await user.save();

    res.json({
      success: true,
      message: 'User rejected'
    });

  } catch (err) {
    console.error('Reject user error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to reject user'
    });
  }
};

// Block/Unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'User blocked' : 'User unblocked'
    });

  } catch (err) {
    console.error('Toggle block user error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has active orders
    const activeOrders = await Order.countDocuments({
      $or: [
        { clientId: id },
        { freelancerId: id }
      ],
      status: { $in: ['pending', 'in_progress', 'delivered'] }
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete user with active orders'
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

// ========== CONTENT MODERATION ==========

// Get pending jobs
exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: false })
      .populate('postedBy', 'name email role company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
      total: jobs.length
    });

  } catch (err) {
    console.error('Get pending jobs error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending jobs'
    });
  }
};

// Approve job
exports.approveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    job.isApproved = true;
    job.approvedBy = req.userId;
    job.approvedAt = Date.now();
    await job.save();

    // Notify job poster
    await notificationService.createNotification({
      userId: job.postedBy,
      type: 'job_posted',
      title: 'Job Approved',
      message: `Your job "${job.title}" has been approved`,
      relatedTo: { model: 'Job', id: job._id },
      actionUrl: `/jobs/${job._id}`,
      priority: 'high',
      channels: { inApp: true, email: true }
    });

    res.json({
      success: true,
      message: 'Job approved successfully'
    });

  } catch (err) {
    console.error('Approve job error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to approve job'
    });
  }
};

// Reject job
exports.rejectJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Notify job poster
    await notificationService.createNotification({
      userId: job.postedBy,
      type: 'job_posted',
      title: 'Job Rejected',
      message: reason || `Your job "${job.title}" was rejected`,
      relatedTo: { model: 'Job', id: job._id },
      priority: 'high',
      channels: { inApp: true, email: true }
    });

    await Job.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Job rejected'
    });

  } catch (err) {
    console.error('Reject job error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to reject job'
    });
  }
};

// Get pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false })
      .populate('organizedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events,
      total: events.length
    });

  } catch (err) {
    console.error('Get pending events error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending events'
    });
  }
};

// Approve event
exports.approveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    event.isApproved = true;
    event.approvedBy = req.userId;
    event.approvedAt = Date.now();
    await event.save();

    // Notify organizer
    await notificationService.createNotification({
      userId: event.organizedBy,
      type: 'event_created',
      title: 'Event Approved',
      message: `Your event "${event.title}" has been approved`,
      relatedTo: { model: 'Event', id: event._id },
      actionUrl: `/events/${event._id}`,
      priority: 'high',
      channels: { inApp: true, email: true }
    });

    res.json({
      success: true,
      message: 'Event approved successfully'
    });

  } catch (err) {
    console.error('Approve event error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to approve event'
    });
  }
};

// Get pending gigs
exports.getPendingGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ isApproved: false })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      gigs,
      total: gigs.length
    });

  } catch (err) {
    console.error('Get pending gigs error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending gigs'
    });
  }
};

// Approve gig
exports.approveGig = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: 'Gig not found'
      });
    }

    gig.isApproved = true;
    gig.approvedBy = req.userId;
    gig.approvedAt = Date.now();
    await gig.save();

    // Notify freelancer
    await notificationService.notifyGigApproved(
      gig._id,
      gig.createdBy,
      gig.title
    );

    res.json({
      success: true,
      message: 'Gig approved successfully'
    });

  } catch (err) {
    console.error('Approve gig error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to approve gig'
    });
  }
};

// ========== PLATFORM ANALYTICS ==========

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalEvents,
      totalGigs,
      totalOrders,
      totalMessages,
      
      pendingApprovals,
      pendingJobs,
      pendingEvents,
      pendingGigs,
      
      activeOrders,
      completedOrders,
      
      revenueData
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Event.countDocuments(),
      Gig.countDocuments(),
      Order.countDocuments(),
      Message.countDocuments(),
      
      User.countDocuments({ 
        role: { $in: ['alumni', 'faculty'] },
        isApproved: false,
        emailVerified: true
      }),
      Job.countDocuments({ isApproved: false }),
      Event.countDocuments({ isApproved: false }),
      Gig.countDocuments({ isApproved: false }),
      
      Order.countDocuments({ 
        status: { $in: ['pending', 'in_progress', 'delivered'] }
      }),
      Order.countDocuments({ status: 'completed' }),
      
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    // User distribution
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivity = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Event.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Gig.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    res.json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          totalJobs,
          totalEvents,
          totalGigs,
          totalOrders,
          totalMessages
        },
        pendingApprovals: {
          users: pendingApprovals,
          jobs: pendingJobs,
          events: pendingEvents,
          gigs: pendingGigs,
          total: pendingApprovals + pendingJobs + pendingEvents + pendingGigs
        },
        orders: {
          active: activeOrders,
          completed: completedOrders,
          total: totalOrders
        },
        revenue: {
          total: revenueData[0]?.total || 0,
          currency: 'INR'
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentActivity: {
          newUsers: recentActivity[0],
          newJobs: recentActivity[1],
          newEvents: recentActivity[2],
          newGigs: recentActivity[3],
          newOrders: recentActivity[4]
        }
      }
    });

  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get user growth analytics
exports.getUserGrowth = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const days = Number(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const growth = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      growth
    });

  } catch (err) {
    console.error('Get user growth error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user growth data'
    });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;

    const days = Number(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const revenue = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          revenue: { $sum: '$price' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category-wise revenue
    const categoryRevenue = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          revenue: { $sum: '$price' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      revenue,
      categoryRevenue
    });

  } catch (err) {
    console.error('Get revenue analytics error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue analytics'
    });
  }
};

// ========== SYSTEM MANAGEMENT ==========

// Send announcement
exports.sendAnnouncement = async (req, res) => {
  try {
    const { title, message, targetRoles, priority = 'high' } = req.body;

    let query = {};
    if (targetRoles && targetRoles.length > 0) {
      query.role = { $in: targetRoles };
    }

    const users = await User.find(query);
    const userIds = users.map(u => u._id);

    await notificationService.notifySystemAnnouncement(userIds, title, message);

    res.json({
      success: true,
      message: `Announcement sent to ${userIds.length} users`
    });

  } catch (err) {
    console.error('Send announcement error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send announcement'
    });
  }
};

// Feature gig
exports.featureGig = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: 'Gig not found'
      });
    }

    gig.isFeatured = isFeatured;
    await gig.save();

    res.json({
      success: true,
      message: isFeatured ? 'Gig featured' : 'Gig unfeatured'
    });

  } catch (err) {
    console.error('Feature gig error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update gig'
    });
  }
};

// Feature event
exports.featureEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    event.isFeatured = isFeatured;
    await event.save();

    res.json({
      success: true,
      message: isFeatured ? 'Event featured' : 'Event unfeatured'
    });

  } catch (err) {
    console.error('Feature event error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
};

module.exports = exports;