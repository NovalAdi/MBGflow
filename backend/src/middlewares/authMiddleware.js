const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'mbgflow_secret_key_12345';

async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the database
      const [rows] = await db.query('SELECT id, name, role, email, status, avatar, kitchenId FROM staff WHERE id = ?', [decoded.id]);

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Tidak terotorisasi, pengguna tidak ditemukan.' });
      }

      req.user = rows[0];
      return next();
    } catch (error) {
      console.error('Auth verification error:', error);
      return res.status(401).json({ error: 'Tidak terotorisasi, token gagal diverifikasi.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Tidak terotorisasi, tidak ada token.' });
  }
}

module.exports = {
  protect,
  JWT_SECRET
};
