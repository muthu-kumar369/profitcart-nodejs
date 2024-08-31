const router = require('express').Router();
const userAuth = require('../../middleware/userMiddleware.js');
const validateReqData = require('../../middleware/validateReqData.js');
const { getWishlist, createFolder, addProduct, updateFolder, removeProduct, removeFolder } = require('../controllers/wishlistController');

router.get('/list', userAuth, getWishlist);
router.post('/create', userAuth, validateReqData("wishlist"), createFolder);
router.post('/add', userAuth, validateReqData("wishlist"), addProduct);
router.patch('/update', userAuth, validateReqData("wishlist"), updateFolder);
router.delete('/remove', userAuth, validateReqData("wishlist"), removeProduct);
router.delete('/remove-folder', userAuth, validateReqData("wishlist"), removeFolder);

module.exports = router;