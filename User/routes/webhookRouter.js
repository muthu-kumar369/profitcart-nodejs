const userAuth = require('../../middleware/userMiddleware');
const { webhook } = require('../controllers/webhookController');

const router=require('express').Router();

router.get('/',userAuth,webhook);

module.exports=router;