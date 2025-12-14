// // backend/services/notificationService.js
// const Notification = require("../models/Notification");
// const User = require("../models/User");
// const nodemailer = require("nodemailer");

// // Email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // ========== NOTIFICATION CREATION HELPERS ==========

// // Generic notification creator
// const createNotification = async (data) => {
//   try {
//     const notification = await Notification.createNotification(data);

//     // Send email if enabled
//     if (data.channels?.email) {
//       await sendEmailNotification(notification);
//     }

//     // Send push if enabled (implement with FCM or similar)
//     if (data.channels?.push) {
//       await sendPushNotification(notification);
//     }

//     // Emit Socket.io event for real-time
//     // if (global.io) {
//     //   global.io.to(data.userId.toString()).emit('notification', notification);
//     // }

//     return notification;
//   } catch (err) {
//     console.error("Create notification error:", err);
//     throw err;
//   }
// };

// // ========== JOB NOTIFICATIONS ==========

// const notifyJobApplication = async (
//   jobId,
//   applicantId,
//   jobTitle,
//   jobPosterId
// ) => {
//   const applicant = await User.findById(applicantId);

//   return createNotification({
//     userId: jobPosterId,
//     type: "job_application",
//     title: "New Job Application",
//     message: `${applicant.name} applied for ${jobTitle}`,
//     actor: applicantId,
//     relatedTo: { model: "Job", id: jobId },
//     actionUrl: `/jobs/${jobId}/applicants`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyApplicationStatus = async (
//   jobId,
//   applicantId,
//   jobTitle,
//   status
// ) => {
//   const statusMessages = {
//     shortlisted: "You have been shortlisted",
//     rejected: "Your application status has been updated",
//     accepted: "Congratulations! You have been selected",
//   };

//   return createNotification({
//     userId: applicantId,
//     type: "application_status",
//     title: statusMessages[status] || "Application Status Updated",
//     message: `Your application for ${jobTitle} has been ${status}`,
//     relatedTo: { model: "Job", id: jobId },
//     actionUrl: `/jobs/${jobId}`,
//     priority: status === "accepted" ? "urgent" : "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyJobDeadline = async (
//   jobId,
//   studentIds,
//   jobTitle,
//   hoursRemaining
// ) => {
//   const notifications = studentIds.map((studentId) =>
//     createNotification({
//       userId: studentId,
//       type: "job_deadline_soon",
//       title: "Job Deadline Approaching",
//       message: `Only ${hoursRemaining} hours left to apply for ${jobTitle}`,
//       relatedTo: { model: "Job", id: jobId },
//       actionUrl: `/jobs/${jobId}`,
//       priority: "high",
//       channels: { inApp: true, email: true },
//     })
//   );

//   return Promise.all(notifications);
// };

// // ========== EVENT NOTIFICATIONS ==========

// const notifyEventRegistration = async (
//   eventId,
//   participantId,
//   eventTitle,
//   organizerId
// ) => {
//   const participant = await User.findById(participantId);

//   return createNotification({
//     userId: organizerId,
//     type: "event_registration",
//     title: "New Event Registration",
//     message: `${participant.name} registered for ${eventTitle}`,
//     actor: participantId,
//     relatedTo: { model: "Event", id: eventId },
//     actionUrl: `/events/${eventId}/registrations`,
//     priority: "normal",
//     channels: { inApp: true },
//   });
// };

// const notifyEventReminder = async (
//   eventId,
//   participantIds,
//   eventTitle,
//   hoursUntil
// ) => {
//   const notifications = participantIds.map((participantId) =>
//     createNotification({
//       userId: participantId,
//       type: "event_reminder",
//       title: "Event Reminder",
//       message: `${eventTitle} starts in ${hoursUntil} hours`,
//       relatedTo: { model: "Event", id: eventId },
//       actionUrl: `/events/${eventId}`,
//       priority: "high",
//       channels: { inApp: true, email: true },
//     })
//   );

//   return Promise.all(notifications);
// };

// const notifyEventCancelled = async (eventId, participantIds, eventTitle) => {
//   const notifications = participantIds.map((participantId) =>
//     createNotification({
//       userId: participantId,
//       type: "event_cancelled",
//       title: "Event Cancelled",
//       message: `${eventTitle} has been cancelled`,
//       relatedTo: { model: "Event", id: eventId },
//       actionUrl: `/events/${eventId}`,
//       priority: "urgent",
//       channels: { inApp: true, email: true },
//     })
//   );

//   return Promise.all(notifications);
// };

// // ========== GIG NOTIFICATIONS ==========

// const notifyGigApproved = async (gigId, freelancerId, gigTitle) => {
//   return createNotification({
//     userId: freelancerId,
//     type: "gig_approved",
//     title: "Gig Approved",
//     message: `Your gig "${gigTitle}" has been approved and is now live`,
//     relatedTo: { model: "Gig", id: gigId },
//     actionUrl: `/gigs/${gigId}`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyNewReview = async (
//   gigId,
//   freelancerId,
//   reviewerId,
//   rating,
//   gigTitle
// ) => {
//   const reviewer = await User.findById(reviewerId);

//   return createNotification({
//     userId: freelancerId,
//     type: "new_review",
//     title: "New Review Received",
//     message: `${reviewer.name} gave you ${rating} stars for "${gigTitle}"`,
//     actor: reviewerId,
//     relatedTo: { model: "Gig", id: gigId },
//     actionUrl: `/gigs/${gigId}`,
//     priority: "normal",
//     channels: { inApp: true, email: true },
//   });
// };

// // ========== ORDER NOTIFICATIONS ==========

// const notifyNewOrder = async (orderId, freelancerId, clientId, orderTitle) => {
//   const client = await User.findById(clientId);

//   return createNotification({
//     userId: freelancerId,
//     type: "new_order",
//     title: "New Order Received",
//     message: `${client.name} placed an order: ${orderTitle}`,
//     actor: clientId,
//     relatedTo: { model: "Order", id: orderId },
//     actionUrl: `/orders/${orderId}`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyOrderAccepted = async (orderId, clientId, orderTitle) => {
//   return createNotification({
//     userId: clientId,
//     type: "order_accepted",
//     title: "Order Accepted",
//     message: `Your order "${orderTitle}" has been accepted`,
//     relatedTo: { model: "Order", id: orderId },
//     actionUrl: `/orders/${orderId}`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyOrderDelivered = async (orderId, clientId, orderTitle) => {
//   return createNotification({
//     userId: clientId,
//     type: "order_delivered",
//     title: "Order Delivered",
//     message: `Your order "${orderTitle}" has been delivered`,
//     relatedTo: { model: "Order", id: orderId },
//     actionUrl: `/orders/${orderId}`,
//     priority: "urgent",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyOrderCompleted = async (orderId, freelancerId, orderTitle) => {
//   return createNotification({
//     userId: freelancerId,
//     type: "order_completed",
//     title: "Order Completed",
//     message: `Order "${orderTitle}" has been marked as completed`,
//     relatedTo: { model: "Order", id: orderId },
//     actionUrl: `/orders/${orderId}`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifyRevisionRequested = async (
//   orderId,
//   freelancerId,
//   orderTitle,
//   reason
// ) => {
//   return createNotification({
//     userId: freelancerId,
//     type: "revision_requested",
//     title: "Revision Requested",
//     message: `Client requested revision for "${orderTitle}"`,
//     relatedTo: { model: "Order", id: orderId },
//     actionUrl: `/orders/${orderId}`,
//     priority: "high",
//     channels: { inApp: true, email: true },
//     metadata: { reason },
//   });
// };

// // ========== MESSAGE NOTIFICATIONS ==========

// const notifyNewMessage = async (messageId, receiverId, senderId) => {
//   const sender = await User.findById(senderId);

//   return createNotification({
//     userId: receiverId,
//     type: "new_message",
//     title: "New Message",
//     message: `${sender.name} sent you a message`,
//     actor: senderId,
//     relatedTo: { model: "Message", id: messageId },
//     actionUrl: `/messages/${senderId}`,
//     priority: "normal",
//     channels: { inApp: true },
//     groupKey: `message_${senderId}_${receiverId}`, // Group multiple messages
//   });
// };

// // ========== SYSTEM NOTIFICATIONS ==========

// const notifyAccountApproved = async (userId, role) => {
//   return createNotification({
//     userId: userId,
//     type: "account_approved",
//     title: "Account Approved",
//     message: `Your ${role} account has been approved. Welcome to Unilancer!`,
//     actionUrl: "/dashboard",
//     priority: "urgent",
//     channels: { inApp: true, email: true },
//   });
// };

// const notifySystemAnnouncement = async (userIds, title, message) => {
//   const notifications = userIds.map((userId) =>
//     createNotification({
//       userId: userId,
//       type: "system_announcement",
//       title: title,
//       message: message,
//       priority: "high",
//       channels: { inApp: true, email: true },
//     })
//   );

//   return Promise.all(notifications);
// };

// // ========== EMAIL NOTIFICATION ==========

// const sendEmailNotification = async (notification) => {
//   try {
//     const user = await User.findById(notification.userId);

//     if (!user || !user.email) {
//       await notification.updateDeliveryStatus("email", "failed");
//       return;
//     }

//     const emailTemplate = getEmailTemplate(notification);

//     await transporter.sendMail({
//       from: `"Unilancer" <${process.env.SMTP_USER}>`,
//       to: user.email,
//       subject: notification.title,
//       html: emailTemplate,
//     });

//     await notification.updateDeliveryStatus("email", "sent");
//   } catch (err) {
//     console.error("Send email notification error:", err);
//     await notification.updateDeliveryStatus("email", "failed");
//   }
// };

// const getEmailTemplate = (notification) => {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: #5B6AEA; color: white; padding: 20px; text-align: center; }
//         .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
//         .button { display: inline-block; padding: 12px 24px; background: #5B6AEA; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
//         .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Unilancer</h1>
//         </div>
//         <div class="content">
//           <h2>${notification.title}</h2>
//           <p>${notification.message}</p>
//           ${
//             notification.actionUrl
//               ? `
//             <a href="${process.env.FRONTEND_URL}${notification.actionUrl}" class="button">
//               View Details
//             </a>
//           `
//               : ""
//           }
//         </div>
//         <div class="footer">
//           <p>This is an automated notification from Unilancer</p>
//           <p>© ${new Date().getFullYear()} Unilancer. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// // ========== PUSH NOTIFICATION ==========

// const sendPushNotification = async (notification) => {
//   // Implement with Firebase Cloud Messaging (FCM) or similar
//   // This is a placeholder
//   try {
//     // TODO: Implement push notification
//     // const fcm = require('firebase-admin');
//     // await fcm.messaging().send({...});

//     await notification.updateDeliveryStatus("push", "sent");
//   } catch (err) {
//     console.error("Send push notification error:", err);
//     await notification.updateDeliveryStatus("push", "failed");
//   }
// };

// // ========== BULK NOTIFICATIONS ==========

// const sendBulkNotifications = async (userIds, notificationData) => {
//   const notifications = userIds.map((userId) =>
//     createNotification({ ...notificationData, userId })
//   );

//   return Promise.all(notifications);
// };

// // ========== EXPORTS ==========

// module.exports = {
//   createNotification,

//   // Job
//   notifyJobApplication,
//   notifyApplicationStatus,
//   notifyJobDeadline,

//   // Event
//   notifyEventRegistration,
//   notifyEventReminder,
//   notifyEventCancelled,

//   // Gig
//   notifyGigApproved,
//   notifyNewReview,

//   // Order
//   notifyNewOrder,
//   notifyOrderAccepted,
//   notifyOrderDelivered,
//   notifyOrderCompleted,
//   notifyRevisionRequested,

//   // Message
//   notifyNewMessage,

//   // System
//   notifyAccountApproved,
//   notifySystemAnnouncement,

//   // Bulk
//   sendBulkNotifications,
// };

// backend/services/notificationService.js
const Notification = require("../models/Notification");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ========== NOTIFICATION CREATION HELPERS ==========

// Generic notification creator
const createNotification = async (data) => {
  try {
    const notification = await Notification.createNotification(data);

    // Send email if enabled
    if (data.channels?.email) {
      await sendEmailNotification(notification);
    }

    // Send push if enabled (implement with FCM or similar)
    if (data.channels?.push) {
      await sendPushNotification(notification);
    }

    // 🔥 Emit Socket.io event for real-time notification
    if (global.io) {
      global.io.to(data.userId.toString()).emit("notification", {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt,
        actor: notification.actor,
      });
      console.log(`📨 Real-time notification sent to user ${data.userId}`);
    }

    return notification;
  } catch (err) {
    console.error("Create notification error:", err);
    throw err;
  }
};

// ========== JOB NOTIFICATIONS ==========

const notifyJobApplication = async (
  jobId,
  applicantId,
  jobTitle,
  jobPosterId
) => {
  const applicant = await User.findById(applicantId);

  return createNotification({
    userId: jobPosterId,
    type: "job_application",
    title: "New Job Application",
    message: `${applicant.name} applied for ${jobTitle}`,
    actor: applicantId,
    relatedTo: { model: "Job", id: jobId },
    actionUrl: `/jobs/${jobId}/applicants`,
    priority: "high",
    channels: { inApp: true, email: true },
  });
};

const notifyApplicationStatus = async (
  jobId,
  applicantId,
  jobTitle,
  status
) => {
  const statusMessages = {
    shortlisted: "You have been shortlisted",
    rejected: "Your application status has been updated",
    accepted: "Congratulations! You have been selected",
  };

  return createNotification({
    userId: applicantId,
    type: "application_status",
    title: statusMessages[status] || "Application Status Updated",
    message: `Your application for ${jobTitle} has been ${status}`,
    relatedTo: { model: "Job", id: jobId },
    actionUrl: `/jobs/${jobId}`,
    priority: status === "accepted" ? "urgent" : "high",
    channels: { inApp: true, email: true },
  });
};

const notifyJobDeadline = async (
  jobId,
  studentIds,
  jobTitle,
  hoursRemaining
) => {
  const notifications = studentIds.map((studentId) =>
    createNotification({
      userId: studentId,
      type: "job_deadline_soon",
      title: "Job Deadline Approaching",
      message: `Only ${hoursRemaining} hours left to apply for ${jobTitle}`,
      relatedTo: { model: "Job", id: jobId },
      actionUrl: `/jobs/${jobId}`,
      priority: "high",
      channels: { inApp: true, email: true },
    })
  );

  return Promise.all(notifications);
};

// ========== EVENT NOTIFICATIONS ==========

const notifyEventRegistration = async (
  eventId,
  participantId,
  eventTitle,
  organizerId
) => {
  const participant = await User.findById(participantId);

  return createNotification({
    userId: organizerId,
    type: "event_registration",
    title: "New Event Registration",
    message: `${participant.name} registered for ${eventTitle}`,
    actor: participantId,
    relatedTo: { model: "Event", id: eventId },
    actionUrl: `/events/${eventId}/registrations`,
    priority: "normal",
    channels: { inApp: true },
  });
};

const notifyEventReminder = async (
  eventId,
  participantIds,
  eventTitle,
  hoursUntil
) => {
  const notifications = participantIds.map((participantId) =>
    createNotification({
      userId: participantId,
      type: "event_reminder",
      title: "Event Reminder",
      message: `${eventTitle} starts in ${hoursUntil} hours`,
      relatedTo: { model: "Event", id: eventId },
      actionUrl: `/events/${eventId}`,
      priority: "high",
      channels: { inApp: true, email: true },
    })
  );

  return Promise.all(notifications);
};

const notifyEventCancelled = async (eventId, participantIds, eventTitle) => {
  const notifications = participantIds.map((participantId) =>
    createNotification({
      userId: participantId,
      type: "event_cancelled",
      title: "Event Cancelled",
      message: `${eventTitle} has been cancelled`,
      relatedTo: { model: "Event", id: eventId },
      actionUrl: `/events/${eventId}`,
      priority: "urgent",
      channels: { inApp: true, email: true },
    })
  );

  return Promise.all(notifications);
};

// ========== GIG NOTIFICATIONS ==========

const notifyGigApproved = async (gigId, freelancerId, gigTitle) => {
  return createNotification({
    userId: freelancerId,
    type: "gig_approved",
    title: "Gig Approved",
    message: `Your gig "${gigTitle}" has been approved and is now live`,
    relatedTo: { model: "Gig", id: gigId },
    actionUrl: `/gigs/${gigId}`,
    priority: "high",
    channels: { inApp: true, email: true },
  });
};

const notifyNewReview = async (
  gigId,
  freelancerId,
  reviewerId,
  rating,
  gigTitle
) => {
  const reviewer = await User.findById(reviewerId);

  return createNotification({
    userId: freelancerId,
    type: "new_review",
    title: "New Review Received",
    message: `${reviewer.name} gave you ${rating} stars for "${gigTitle}"`,
    actor: reviewerId,
    relatedTo: { model: "Gig", id: gigId },
    actionUrl: `/gigs/${gigId}`,
    priority: "normal",
    channels: { inApp: true, email: true },
  });
};

// ========== ORDER NOTIFICATIONS ==========

const notifyNewOrder = async (orderId, freelancerId, clientId, orderTitle) => {
  const client = await User.findById(clientId);

  return createNotification({
    userId: freelancerId,
    type: "new_order",
    title: "New Order Received",
    message: `${client.name} placed an order: ${orderTitle}`,
    actor: clientId,
    relatedTo: { model: "Order", id: orderId },
    actionUrl: `/orders/${orderId}`,
    priority: "high",
    channels: { inApp: true, email: true },
  });
};

const notifyOrderAccepted = async (orderId, clientId, orderTitle) => {
  return createNotification({
    userId: clientId,
    type: "order_accepted",
    title: "Order Accepted",
    message: `Your order "${orderTitle}" has been accepted`,
    relatedTo: { model: "Order", id: orderId },
    actionUrl: `/orders/${orderId}`,
    priority: "high",
    channels: { inApp: true, email: true },
  });
};

const notifyOrderDelivered = async (orderId, clientId, orderTitle) => {
  return createNotification({
    userId: clientId,
    type: "order_delivered",
    title: "Order Delivered",
    message: `Your order "${orderTitle}" has been delivered`,
    relatedTo: { model: "Order", id: orderId },
    actionUrl: `/orders/${orderId}`,
    priority: "urgent",
    channels: { inApp: true, email: true },
  });
};

const notifyOrderCompleted = async (orderId, freelancerId, orderTitle) => {
  return createNotification({
    userId: freelancerId,
    type: "order_completed",
    title: "Order Completed",
    message: `Order "${orderTitle}" has been marked as completed`,
    relatedTo: { model: "Order", id: orderId },
    actionUrl: `/orders/${orderId}`,
    priority: "high",
    channels: { inApp: true, email: true },
  });
};

const notifyRevisionRequested = async (
  orderId,
  freelancerId,
  orderTitle,
  reason
) => {
  return createNotification({
    userId: freelancerId,
    type: "revision_requested",
    title: "Revision Requested",
    message: `Client requested revision for "${orderTitle}"`,
    relatedTo: { model: "Order", id: orderId },
    actionUrl: `/orders/${orderId}`,
    priority: "high",
    channels: { inApp: true, email: true },
    metadata: { reason },
  });
};

// ========== MESSAGE NOTIFICATIONS ==========

const notifyNewMessage = async (messageId, receiverId, senderId) => {
  const sender = await User.findById(senderId);

  return createNotification({
    userId: receiverId,
    type: "new_message",
    title: "New Message",
    message: `${sender.name} sent you a message`,
    actor: senderId,
    relatedTo: { model: "Message", id: messageId },
    actionUrl: `/messages/${senderId}`,
    priority: "normal",
    channels: { inApp: true },
    groupKey: `message_${senderId}_${receiverId}`, // Group multiple messages
  });
};

// ========== SYSTEM NOTIFICATIONS ==========

const notifyAccountApproved = async (userId, role) => {
  return createNotification({
    userId: userId,
    type: "account_approved",
    title: "Account Approved",
    message: `Your ${role} account has been approved. Welcome to Unilancer!`,
    actionUrl: "/dashboard",
    priority: "urgent",
    channels: { inApp: true, email: true },
  });
};

const notifySystemAnnouncement = async (userIds, title, message) => {
  const notifications = userIds.map((userId) =>
    createNotification({
      userId: userId,
      type: "system_announcement",
      title: title,
      message: message,
      priority: "high",
      channels: { inApp: true, email: true },
    })
  );

  return Promise.all(notifications);
};

// ========== EMAIL NOTIFICATION ==========

const sendEmailNotification = async (notification) => {
  try {
    const user = await User.findById(notification.userId);

    if (!user || !user.email) {
      await notification.updateDeliveryStatus("email", "failed");
      return;
    }

    const emailTemplate = getEmailTemplate(notification);

    await transporter.sendMail({
      from: `"Unilancer" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: notification.title,
      html: emailTemplate,
    });

    await notification.updateDeliveryStatus("email", "sent");
  } catch (err) {
    console.error("Send email notification error:", err);
    await notification.updateDeliveryStatus("email", "failed");
  }
};

const getEmailTemplate = (notification) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #5B6AEA; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #5B6AEA; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Unilancer</h1>
        </div>
        <div class="content">
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          ${
            notification.actionUrl
              ? `
            <a href="${process.env.FRONTEND_URL}${notification.actionUrl}" class="button">
              View Details
            </a>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p>This is an automated notification from Unilancer</p>
          <p>© ${new Date().getFullYear()} Unilancer. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ========== PUSH NOTIFICATION ==========

const sendPushNotification = async (notification) => {
  // Implement with Firebase Cloud Messaging (FCM) or similar
  // This is a placeholder
  try {
    // TODO: Implement push notification
    // const fcm = require('firebase-admin');
    // await fcm.messaging().send({...});

    await notification.updateDeliveryStatus("push", "sent");
  } catch (err) {
    console.error("Send push notification error:", err);
    await notification.updateDeliveryStatus("push", "failed");
  }
};

// ========== BULK NOTIFICATIONS ==========

const sendBulkNotifications = async (userIds, notificationData) => {
  const notifications = userIds.map((userId) =>
    createNotification({ ...notificationData, userId })
  );

  return Promise.all(notifications);
};

// ========== EXPORTS ==========

module.exports = {
  createNotification,

  // Job
  notifyJobApplication,
  notifyApplicationStatus,
  notifyJobDeadline,

  // Event
  notifyEventRegistration,
  notifyEventReminder,
  notifyEventCancelled,

  // Gig
  notifyGigApproved,
  notifyNewReview,

  // Order
  notifyNewOrder,
  notifyOrderAccepted,
  notifyOrderDelivered,
  notifyOrderCompleted,
  notifyRevisionRequested,

  // Message
  notifyNewMessage,

  // System
  notifyAccountApproved,
  notifySystemAnnouncement,

  // Bulk
  sendBulkNotifications,
};
