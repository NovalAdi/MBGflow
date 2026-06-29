const { Hono } = require('hono');
const router = new Hono();
const kitchenController = require('../controllers/kitchenController');
const { protect } = require('../middlewares/authMiddleware');
const { toExpress, toExpressMiddleware } = require('../utils/expressCompat');

const protectMiddleware = toExpressMiddleware(protect);

// Public routes (no auth required)
router.get('/public', toExpress(kitchenController.getKitchens));

// Protected routes
router.get('/', protectMiddleware, toExpress(kitchenController.getKitchens));
router.post('/', protectMiddleware, toExpress(kitchenController.createKitchen));
router.post('/parse-maps-url', protectMiddleware, toExpress(kitchenController.parseMapsUrl));
router.put('/:id', protectMiddleware, toExpress(kitchenController.updateKitchen));
router.delete('/:id', protectMiddleware, toExpress(kitchenController.deleteKitchen));
router.get('/:id/detail', protectMiddleware, toExpress(kitchenController.getKitchenDetail));
router.post('/:id/staff', protectMiddleware, toExpress(kitchenController.addKitchenStaff));

module.exports = router;
