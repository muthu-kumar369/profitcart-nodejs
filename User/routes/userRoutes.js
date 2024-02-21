const userAuth = require("../../middleware/userMiddleware");
const { login, register, userProfileDetails } = require("../controllers/userController");

const router= require("express").Router();

router.post("/login",login);
router.post("/register",register);
router.get("/profile-details",userAuth,userProfileDetails);

module.exports=router;