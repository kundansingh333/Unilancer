// ========================================================
// backend/routes/gigs.js
// ========================================================

const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// ========== PUBLIC ROUTES ==========

/**
 * @route   GET /api/gigs
 * @desc    Get all gigs (with filters & pagination)
 * @access  Public
 * @query   page, limit, search, category, minPrice, maxPrice, maxDeliveryTime, minRating, sortBy, order
 */
router.get('/', gigController.getAllGigs);

/**
 * @route   GET /api/gigs/top-rated
 * @desc    Get top rated gigs
 * @access  Public
 */
router.get('/top-rated', gigController.getTopRatedGigs);

/**
 * @route   GET /api/gigs/featured
 * @desc    Get featured gigs
 * @access  Public
 */
router.get('/featured', gigController.getFeaturedGigs);

/**
 * @route   GET /api/gigs/freelancer/:freelancerId
 * @desc    Get all gigs by a freelancer
 * @access  Public
 */
router.get('/freelancer/:freelancerId', gigController.getFreelancerGigs);

/**
 * @route   GET /api/gigs/:id
 * @desc    Get single gig by ID
 * @access  Public
 */
router.get('/:id', gigController.getGigById);

// ========== PROTECTED ROUTES ==========

/**
 * @route   GET /api/gigs/my/gigs
 * @desc    Get all my gigs
 * @access  Private (Students, Alumni)
 */
router.get('/my/gigs', auth, roleAuth('student', 'alumni'), gigController.getMyGigs);

/**
 * @route   POST /api/gigs
 * @desc    Create a new gig
 * @access  Private (Students, Alumni)
 */
router.post('/', auth, roleAuth('student', 'alumni'), gigController.createGig);

/**
 * @route   PUT /api/gigs/:id
 * @desc    Update a gig
 * @access  Private (Gig owner)
 */
router.put('/:id', auth, roleAuth('student', 'alumni'), gigController.updateGig);

/**
 * @route   DELETE /api/gigs/:id
 * @desc    Delete a gig
 * @access  Private (Gig owner or Admin)
 */
router.delete('/:id', auth, gigController.deleteGig);

/**
 * @route   PUT /api/gigs/:id/status
 * @desc    Pause/Resume a gig
 * @access  Private (Gig owner)
 */
router.put('/:id/status', auth, roleAuth('student', 'alumni'), gigController.toggleGigStatus);

/**
 * @route   POST /api/gigs/:id/review
 * @desc    Add a review to a gig
 * @access  Private
 */
router.post('/:id/review', auth, gigController.addReview);

/**
 * @route   PUT /api/gigs/:id/reviews/:reviewId/helpful
 * @desc    Mark a review as helpful
 * @access  Private
 */
router.put('/:id/reviews/:reviewId/helpful', auth, gigController.markReviewHelpful);

/**
 * @route   GET /api/gigs/:id/stats
 * @desc    Get gig statistics
 * @access  Private (Gig owner)
 */
router.get('/:id/stats', auth, roleAuth('student', 'alumni'), gigController.getGigStats);

module.exports = router;