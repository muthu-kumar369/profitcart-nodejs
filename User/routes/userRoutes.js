const userAuth = require("../../middleware/userMiddleware");
const validateReqData = require("../../middleware/validateReqData");
const { login, register, userProfileDetails } = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", validateReqData("user"), login);
router.post("/register", validateReqData("user"), register);
router.get("/profile-details", userAuth, userProfileDetails);

module.exports = router;