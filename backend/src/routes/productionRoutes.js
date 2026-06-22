const { Hono } = require('hono');
const router = new Hono();
const productionController = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

// Apply protection middleware to all sub-routes
router.use('*', toExpressMiddleware(protect));

router.get('/activity', toExpress(productionController.getActivity));
router.get('/production-plans', toExpress(productionController.getProductionPlans));
router.post('/production-plans', toExpress(productionController.createProductionPlan));
router.put('/production-plans/:id', toExpress(productionController.updateProductionPlan));
router.delete('/production-plans/:id', toExpress(productionController.deleteProductionPlan));
router.post('/production-logs/finish', toExpress(productionController.finishProductionLog));
router.post('/production-logs/start', toExpress(productionController.startProductionLog));
router.get('/menus', toExpress(productionController.getMenus));
router.get('/daily-recap', toExpress(productionController.getDailyRecap));

// Notifications endpoints
router.get('/notifications', toExpress(productionController.getNotifications));
router.post('/notifications', toExpress(productionController.createNotification));
router.put('/notifications/:id/read', toExpress(productionController.markNotificationRead));
router.delete('/notifications/:id', toExpress(productionController.deleteNotification));

module.exports = router;
