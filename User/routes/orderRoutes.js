const router=require('express').Router();
const userAuth=require('../../middleware/userMiddleware.js');
const { listOrder, createOrder, cancelOrder, updateAddress, createBulkOrder } = require('../controllers/orderController.js');

router.get('/list', userAuth,listOrder);
router.post('/create',userAuth,createOrder);
router.patch('/cancel',userAuth,cancelOrder);
router.patch('/update',userAuth,updateAddress);
router.post("/create-bulk",userAuth,createBulkOrder);

module.exports=router;