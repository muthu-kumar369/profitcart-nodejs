const router=require('express').Router();
const userAuth=require('../../middleware/userMiddleware.js');
const { getWishlist, createFolder, addProduct, updateFolder, removeProduct, removeFolder } = require('../controllers/wishlistController');

router.get('/list',userAuth,getWishlist);
router.post('/create',userAuth,createFolder);
router.post('/add',userAuth,addProduct);
router.patch('/update',userAuth,updateFolder);
router.delete('/remove',userAuth,removeProduct);
router.delete('/remove-folder',userAuth,removeFolder);

module.exports=router;