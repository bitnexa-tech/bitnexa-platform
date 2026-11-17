const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendOtpEmail } = require('../utils/mailer');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Send 6-digit OTP to user email
 */
async function sendOtp(req, res) {
  try {
    const { email, name, role } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || '').trim();

    // Check if user already exists to personalize message
    const findUser = db.prepare('SELECT name, role FROM users WHERE email = ?');
    const existingUser = findUser.get(cleanEmail);

    const displayName = cleanName || (existingUser ? existingUser.name : 'Partner');

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Invalidate prior unused OTPs for this email
    const invalidatePrior = db.prepare('UPDATE otps SET used = 1 WHERE email = ? AND used = 0');
    invalidatePrior.run(cleanEmail);

    // Save new OTP
    const insertOtp = db.prepare(`
      INSERT INTO otps (email, otp, expires_at, used)
      VALUES (?, ?, ?, 0)
    `);
    insertOtp.run(cleanEmail, otp, expiresAt);

    // Send email or log in console
    const mailResult = await sendOtpEmail(cleanEmail, otp, displayName);

    const isDev = process.env.NODE_ENV !== 'production' || !process.env.SMTP_HOST;

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}. Check your email inbox (or server console in development).`,
      // Provide devOtp during development/localhost testing for zero friction
      devOtp: isDev ? otp : undefined,
    });
  } catch (error) {
    console.error('[AuthController.sendOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate and send OTP. Please try again.',
      error: error.message,
    });
  }
}

/**
 * Verify OTP and issue JWT session token
 */
async function verifyOtp(req, res) {
  try {
    const { email, otp, name, role, skills, phone } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Both email and OTP code are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Find valid OTP record
    const findOtp = db.prepare(`
      SELECT id, otp, expires_at, used 
      FROM otps 
      WHERE email = ? AND used = 0 
      ORDER BY id DESC LIMIT 1
    `);
    const otpRecord = findOtp.get(cleanEmail);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found for this email. Please request a new code.',
      });
    }

    if (Date.now() > otpRecord.expires_at) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has expired. Please request a fresh one.',
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    // Mark OTP as used
    const markUsed = db.prepare('UPDATE otps SET used = 1 WHERE id = ?');
    markUsed.run(otpRecord.id);

    // Check if user already exists
    const findUser = db.prepare('SELECT id, name, email, role, skills, phone, created_at FROM users WHERE email = ?');
    let user = findUser.get(cleanEmail);

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@agency.com').trim().toLowerCase();

    if (!user) {
      // Determine role
      let assignedRole = role && ['client', 'worker', 'admin'].includes(role) ? role : 'client';

      // Security check: Only designated admin email can register as admin
      if (assignedRole === 'admin' && cleanEmail !== adminEmail) {
        assignedRole = 'client';
      }

      // Default name fallback if blank
      const finalName = (name || '').trim() || cleanEmail.split('@')[0];
      const finalSkills = (skills || '').trim();
      const finalPhone = (phone || '').trim();

      const insertUser = db.prepare(`
        INSERT INTO users (name, email, role, skills, phone)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = insertUser.run(finalName, cleanEmail, assignedRole, finalSkills, finalPhone);

      user = findUser.get(cleanEmail);
    } else {
      // If user exists, optionally update name/phone/skills if provided
      if (name || phone || skills) {
        const updateUser = db.prepare(`
          UPDATE users 
          SET name = COALESCE(NULLIF(?, ''), name),
              phone = COALESCE(NULLIF(?, ''), phone),
              skills = COALESCE(NULLIF(?, ''), skills)
          WHERE id = ?
        `);
        updateUser.run((name || '').trim(), (phone || '').trim(), (skills || '').trim(), user.id);
        user = findUser.get(cleanEmail);
      }
    }

    // Issue JWT Token valid for 7 days
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}! Authentication successful.`,
      token,
      user,
    });
  } catch (error) {
    console.error('[AuthController.verifyOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to an internal error.',
      error: error.message,
    });
  }
}

/**
 * Get current authenticated user profile
 */
async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Update authenticated user's profile
 */
async function updateProfile(req, res) {
  try {
    const { name, phone, skills } = req.body;
    const userId = req.user.id;

    const updateUser = db.prepare(`
      UPDATE users 
      SET name = COALESCE(NULLIF(?, ''), name),
          phone = COALESCE(NULLIF(?, ''), phone),
          skills = COALESCE(NULLIF(?, ''), skills)
      WHERE id = ?
    `);

    updateUser.run(
      (name || '').trim(),
      (phone || '').trim(),
      (skills || '').trim(),
      userId
    );

    const refreshed = db.prepare('SELECT id, name, email, role, skills, phone, created_at FROM users WHERE id = ?').get(userId);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: refreshed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  getMe,
  updateProfile,
};
