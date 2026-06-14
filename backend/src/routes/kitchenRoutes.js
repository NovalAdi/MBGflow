const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', kitchenController.getKitchens);
router.post('/', kitchenController.createKitchen);
router.post('/parse-maps-url', kitchenController.parseMapsUrl);
router.put('/:id', kitchenController.updateKitchen);
router.delete('/:id', kitchenController.deleteKitchen);
router.get('/:id/detail', kitchenController.getKitchenDetail);
router.post('/:id/staff', kitchenController.addKitchenStaff);

module.exports = router;
