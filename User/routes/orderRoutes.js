const router = require('express').Router();
const userAuth = require('../../middleware/userMiddleware.js');
const validateReqData = require('../../middleware/validateReqData.js');
const { listOrder, createOrder, cancelOrder, updateAddress, createBulkOrder, getProduct } = require('../controllers/orderController.js');

router.get('/list', userAuth, listOrder);
router.post('/create', userAuth, validateReqData("order"), createOrder);
router.patch('/cancel', userAuth, validateReqData("order"), cancelOrder);
router.patch('/update', userAuth, validateReqData("order"), updateAddress);
router.post("/create-bulk", userAuth, validateReqData("order"), createBulkOrder);
router.get("/get-product/:orderId/:productId", userAuth, getProduct);
module.exports = router;