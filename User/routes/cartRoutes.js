const userAuth = require('../../middleware/userMiddleware');
const { listCart, addProduct, removeProdct, updateLater, quantityUpdate, removeOrderedProducts } = require('../controllers/cartController');
// const{listOfBuyLater}=require('../controllers/cartController.js');
const router=require('express').Router();

router.get("/list",userAuth,listCart);
router.post("/add-cart",userAuth, addProduct);
router.delete("/remove",userAuth,removeProdct);
router.patch('/update-buy-later',userAuth,updateLater);
router.patch('/update-quantity',userAuth,quantityUpdate);
router.delete('/remove-products',userAuth,removeOrderedProducts);
// router.get('/list-buy-later',userAuth,listOfBuyLater);

module.exports=router;