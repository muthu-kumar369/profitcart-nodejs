const userAuth = require('../../middleware/userMiddleware');
const validateReqData = require('../../middleware/validateReqData');
const { listAddress, createAddress, updateAddress, removeAddress, updateDefaultAddress } = require('../controllers/addressController');

const router = require('express').Router();

router.get('/list', userAuth, listAddress);
router.post('/create', userAuth, validateReqData("address"), createAddress);
router.patch('/update', userAuth, validateReqData("address"), updateAddress);
router.patch("/update-default/:id", userAuth, updateDefaultAddress);
router.delete("/remove/:id", userAuth, removeAddress);

module.exports = router;