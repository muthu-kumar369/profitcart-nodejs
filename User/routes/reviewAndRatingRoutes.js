const userAuth = require('../../middleware/userMiddleware');
const { getReview, createReview, updateReview, removeReview } = require('../controllers/reviewAndRatingController');
const router=require('express').Router();

router.get('/list',getReview);
router.post('/create',userAuth,createReview);
router.patch('/update',userAuth,updateReview);
router.delete('/delete',userAuth,removeReview);

module.exports=router;