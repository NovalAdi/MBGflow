const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public route
router.post('/login', authController.login);

// Protected route
router.get('/staff', protect, authController.getStaff);

module.exports = router;
