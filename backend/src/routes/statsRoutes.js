const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats', protect, statsController.getStats);

module.exports = router;
