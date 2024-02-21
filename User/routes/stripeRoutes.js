const userAuth = require('../../middleware/userMiddleware');
const { addProduct, retrievePriceDetails, createSession } = require('../controllers/stripeController');

const router=require('express').Router();

router.post('/add-product',userAuth,addProduct);
router.post("/get-pricing",userAuth,retrievePriceDetails);
router.post("/get-session",userAuth,createSession);

module.exports=router;