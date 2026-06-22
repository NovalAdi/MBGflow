const { Hono } = require('hono');
const router = new Hono();
const statsController = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

router.get('/stats', toExpressMiddleware(protect), toExpress(statsController.getStats));

module.exports = router;
