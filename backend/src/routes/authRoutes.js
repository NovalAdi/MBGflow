const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public route
router.post('/login', authController.login);

// Protected routes
router.get('/staff', protect, authController.getStaff);
router.put('/staff/:id', protect, authController.updateStaff);
router.delete('/staff/:id', protect, authController.deleteStaff);

module.exports = router;
