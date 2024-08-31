const userAuth = require('../../middleware/userMiddleware');
const validateReqData = require('../../middleware/validateReqData');
const { listCart, addProduct, removeProduct, updateLater, quantityUpdate, removeOrderedProducts } = require('../controllers/cartController');
// const{listOfBuyLater}=require('../controllers/cartController.js');
const router = require('express').Router();

router.get("/list", userAuth, listCart);
router.post("/add-cart", userAuth,validateReqData("cart"), addProduct);
router.delete("/remove", userAuth,validateReqData("cart"), removeProduct);
router.patch('/update-buy-later', userAuth, updateLater);
router.patch('/update-quantity',userAuth,validateReqData("cart"),  quantityUpdate);
router.delete('/remove-products',validateReqData("cart"), userAuth, removeOrderedProducts);
// router.get('/list-buy-later',userAuth,listOfBuyLater);

module.exports = router;