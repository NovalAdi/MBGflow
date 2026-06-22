const { Hono } = require('hono');
const router = new Hono();
const inventoryController = require('../controllers/inventoryController');
const stockVerificationController = require('../controllers/stockVerificationController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

// Apply protection middleware to all sub-routes
router.use('*', toExpressMiddleware(protect));

router.get('/inventory', toExpress(inventoryController.getInventory));
router.get('/inventory/material-availability', toExpress(inventoryController.getMaterialAvailability));
router.get('/stock-requests', toExpress(inventoryController.getStockRequests));
router.post('/stock-requests', toExpress(inventoryController.createStockRequest));
router.post('/stock-requests/batch', toExpress(inventoryController.createStockRequestBatch));
router.put('/stock-requests/:id/status', toExpress(inventoryController.updateStockRequestStatus));
router.post('/stock-requests/validate-arrival', toExpress(inventoryController.validateStockArrival));
router.post('/wastage', toExpress(inventoryController.reportWastage));
router.get('/wastage', toExpress(inventoryController.getWastage));
router.get('/chef/dashboard/:kitchenId', toExpress(inventoryController.getChefDashboardData));

// Stock verification routes
router.get('/stock-verifications/status', toExpress(stockVerificationController.checkVerificationStatus));
router.get('/stock-verifications/last-cooked', toExpress(stockVerificationController.getLastCookedMenu));
router.post('/stock-verifications', toExpress(stockVerificationController.submitVerification));

module.exports = router;
