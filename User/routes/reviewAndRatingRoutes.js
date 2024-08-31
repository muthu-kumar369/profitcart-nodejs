const userAuth = require('../../middleware/userMiddleware');
const validateReqData = require('../../middleware/validateReqData');
const { getReview, createReview, updateReview, removeReview } = require('../controllers/reviewAndRatingController');
const router = require('express').Router();

router.get('/list', getReview);
router.post('/create', userAuth, validateReqData("review"), createReview);
router.patch('/update', userAuth, validateReqData("review"), updateReview);
router.delete('/delete', userAuth, validateReqData("review"), removeReview);

module.exports = router;