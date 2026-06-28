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
    const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
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
      return res.status(403).json({ error: 'Akses ditolak. Anda tidak memiliki akses ke aplikasi ini.' });
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

async function getUsers(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT id, name, role, status, avatar, kitchenId, email FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
}

async function updateUser(req, res) {
  await delay(100);
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const current = rows[0];
    
    // Check if email already registered to someone else
    if (email && email.toLowerCase() !== current.email.toLowerCase()) {
      const [existing] = await db.query('SELECT * FROM users WHERE LOWER(email) = ? AND id != ?', [email.toLowerCase(), id]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email sudah terdaftar.' });
      }
    }

    let passwordHash = current.password;
    if (password) {
      const bcrypt = require('bcryptjs');
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = {
      name: name || current.name,
      email: email ? email.toLowerCase() : current.email,
      role: role || current.role,
      password: passwordHash
    };

    await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
      [updated.name, updated.email, updated.role, updated.password, id]
    );

    res.json({ success: true, message: 'User successfully updated.' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error updating user.' });
  }
}

async function deleteUser(req, res) {
  await delay(100);
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await db.query('UPDATE users SET kitchenId = NULL WHERE id = ?', [id]);
    res.json({ success: true, message: 'User successfully unassigned from kitchen.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error deleting/unassigning user.' });
  }
}

async function getDrivers(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.role, u.status, u.avatar, u.email, u.kitchenId,
             k.name as kitchenName, k.city as kitchenCity, k.address as kitchenAddress
      FROM users u
      LEFT JOIN kitchens k ON u.kitchenId = k.id
      WHERE u.role = 'Driver'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Drivers list error:', error);
    res.status(500).json({ error: 'Server error fetching drivers.' });
  }
}

async function driverLogin(req, res) {
  await delay(150);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Kredensial tidak valid: email tidak terdaftar.' });
    }

    const user = rows[0];

    // Check if role is Driver
    if (user.role !== 'Driver') {
      return res.status(403).json({ error: 'Akses ditolak. Akun ini bukan merupakan akun Driver.' });
    }
    
    // Compare hashed password or plain text password
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Kata sandi salah. Silakan coba lagi.' });
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
    console.error('Driver login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
}

module.exports = {
  login,
  getUsers,
  updateUser,
  deleteUser,
  getDrivers,
  driverLogin
};
