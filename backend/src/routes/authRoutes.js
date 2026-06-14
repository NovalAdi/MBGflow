const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public route
router.post('/login', authController.login);

// Protected routes
router.get('/users', protect, authController.getUsers);
router.put('/users/:id', protect, authController.updateUser);
router.delete('/users/:id', protect, authController.deleteUser);

module.exports = router;
