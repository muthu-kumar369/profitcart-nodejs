const router=require('express').Router();
const userAuth= require('../../middleware/userMiddleware.js');
const { getNotification, createNotification, updateRead, removeNotification } = require('../controllers/notificationController');


router.get("/list",userAuth,getNotification);
router.post('/create',userAuth,createNotification);
router.patch('/update-read',userAuth,updateRead);
router.delete('/remove',userAuth,removeNotification)

module.exports=router;