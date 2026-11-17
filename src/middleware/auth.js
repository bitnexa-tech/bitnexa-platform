const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_agency_2025';

/**
 * Authenticate incoming request using Bearer JWT
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please log in.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    // Verify user exists in database
    const getUserStmt = db.prepare('SELECT id, name, email, role, skills, phone, created_at FROM users WHERE id = ?');
    const user = getUserStmt.get(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    req.user = user;
    next();
  });
}

/**
 * Restrict route access to specific roles
 * @param  {...string} roles - e.g. 'admin', 'client', 'worker'
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: [${roles.join(', ')}]. Your current role is '${req.user ? req.user.role : 'none'}'.`,
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET,
};
