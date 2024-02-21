const userAuth = require('../../middleware/userMiddleware');
const { listAddress, createAddress, updateAddress, removeAddress, updateDefaultAddress } = require('../controllers/addressController');

const router=require('express').Router();

router.get('/list',userAuth,listAddress);
router.post('/create',userAuth,createAddress);
router.patch('/update',userAuth,updateAddress);
router.patch("/update-default/:id",userAuth,updateDefaultAddress);
router.delete("/remove/:id",userAuth,removeAddress);

module.exports=router;