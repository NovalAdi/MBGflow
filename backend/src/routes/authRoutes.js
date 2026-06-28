const { Hono } = require('hono');
const router = new Hono();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

// Public route
router.post('/login', toExpress(authController.login));
router.get('/drivers', toExpress(authController.getDrivers));
router.post('/driver/login', toExpress(authController.driverLogin));

// Protected routes
router.get('/users', toExpressMiddleware(protect), toExpress(authController.getUsers));
router.put('/users/:id', toExpressMiddleware(protect), toExpress(authController.updateUser));
router.delete('/users/:id', toExpressMiddleware(protect), toExpress(authController.deleteUser));

module.exports = router;
