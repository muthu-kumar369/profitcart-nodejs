const router = require('express').Router();
const userAuth = require('../../middleware/userMiddleware.js');
const validateReqData = require('../../middleware/validateReqData.js');
const { getNotification, createNotification, updateRead, removeNotification } = require('../controllers/notificationController');


router.get("/list", userAuth, getNotification);
router.post('/create', userAuth, validateReqData("notification"), createNotification);
router.patch('/update-read', userAuth, validateReqData("notification"), updateRead);
router.delete('/remove', userAuth, validateReqData("notification"), removeNotification)

module.exports = router;