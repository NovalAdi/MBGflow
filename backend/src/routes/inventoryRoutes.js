const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/inventory', inventoryController.getInventory);
router.get('/inventory/material-availability', inventoryController.getMaterialAvailability);
router.get('/stock-requests', inventoryController.getStockRequests);
router.post('/stock-requests', inventoryController.createStockRequest);
router.post('/stock-requests/batch', inventoryController.createStockRequestBatch);
router.put('/stock-requests/:id/status', inventoryController.updateStockRequestStatus);
router.post('/wastage', inventoryController.reportWastage);
router.get('/wastage', inventoryController.getWastage);
router.get('/chef/dashboard/:kitchenId', inventoryController.getChefDashboardData);

module.exports = router;
