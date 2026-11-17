const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public OTP endpoints
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// Authenticated user profile
router.get('/me', authenticateToken, authController.getMe);
router.patch('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
