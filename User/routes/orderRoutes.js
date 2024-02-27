const router=require('express').Router();
const userAuth=require('../../middleware/userMiddleware.js');
const { listOrder, createOrder, cancelOrder, updateAddress, createBulkOrder, getProduct } = require('../controllers/orderController.js');

router.get('/list', userAuth,listOrder);
router.post('/create',userAuth,createOrder);
router.patch('/cancel',userAuth,cancelOrder);
router.patch('/update',userAuth,updateAddress);
router.post("/create-bulk",userAuth,createBulkOrder);
router.get("/get-product/:orderId/:productId",userAuth,getProduct);
module.exports=router;