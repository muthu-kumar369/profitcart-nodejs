const { productList, productDetails, proudctForIndex } = require('../controllers/productController');

const router=require('express').Router();

router.get("/list",productList);
router.get('/details/:id',productDetails);
router.get("/index",proudctForIndex);

module.exports=router;