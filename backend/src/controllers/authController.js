const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function login(req, res) {
  await delay(150);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM staff WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Kredensial tidak valid: email tidak terdaftar.' });
    }

    const user = rows[0];
    
    // Compare hashed password or plain text password if migration/hashing isn't done yet
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Kata sandi salah. Silakan coba lagi.' });
    }

    const allowedRoles = ['Admin', 'Chef', 'Head Chef'];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Akses ditolak. Staf dapur dan Perwakilan sekolah tidak diizinkan mengakses website ini.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '30d',
    });

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
}

async function getStaff(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT id, name, role, status, avatar, kitchenId, email FROM staff');
    res.json(rows);
  } catch (error) {
    console.error('Staff list error:', error);
    res.status(500).json({ error: 'Server error fetching staff.' });
  }
}

module.exports = {
  login,
  getStaff
};
