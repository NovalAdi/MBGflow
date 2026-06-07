const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/activity', productionController.getActivity);
router.get('/production-plans', productionController.getProductionPlans);
router.post('/production-plans', productionController.createProductionPlan);
router.put('/production-plans/:id', productionController.updateProductionPlan);
router.delete('/production-plans/:id', productionController.deleteProductionPlan);
router.post('/production-logs/finish', productionController.finishProductionLog);
router.post('/production-logs/start', productionController.startProductionLog);
router.get('/menus', productionController.getMenus);

module.exports = router;
