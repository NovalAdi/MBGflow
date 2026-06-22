const { Hono } = require('hono');
const router = new Hono();
const kitchenController = require('../controllers/kitchenController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

// Apply protection middleware to all sub-routes
router.use('*', toExpressMiddleware(protect));

router.get('/', toExpress(kitchenController.getKitchens));
router.post('/', toExpress(kitchenController.createKitchen));
router.post('/parse-maps-url', toExpress(kitchenController.parseMapsUrl));
router.put('/:id', toExpress(kitchenController.updateKitchen));
router.delete('/:id', toExpress(kitchenController.deleteKitchen));
router.get('/:id/detail', toExpress(kitchenController.getKitchenDetail));
router.post('/:id/staff', toExpress(kitchenController.addKitchenStaff));

module.exports = router;
