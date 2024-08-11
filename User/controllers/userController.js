const { Response } = require("../../services/ResponseService")
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const config = require("../../config.js");
const jwt = require("jsonwebtoken");
const Wishlist = require("../models/wishlistModel.js");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await User.findOne({ email });
        if (userDetails) {
            const match = await bcrypt.compare(password, userDetails.password);
            if (match) {
                const jwtToken = await jwt.sign({ userId: userDetails._id, email: userDetails.email }, process.env.security_key, { expiresIn: '30d' });
                await User.findOneAndUpdate({ _id: userDetails._id }, {
                    token: jwtToken
                });

                Response(res, 200, config.success_message, "Login successfull", await User.findOne({ _id: userDetails._id }))
            } else {
                Response(res, 400, config.error_message, "Password doesn't match", null)
            }
        } else {
            Response(res, 400, config.error_message, "User doesn't exist!")
        }
    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, userRole } = req.body;

        const userDetails = await User.findOne({ email });
        console.log(userDetails);
        if (!userDetails) {
            const user = await User.create({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                userRole
            });

            await Wishlist.create({
                name: "General",
                userId: user._id
            });
            Response(res, 200, config.success_message, "Registered successfully!", null)

        }
        else {
            Response(res, 400, config.error_message, "User already exist!", null)
        }

    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const userProfileDetails = async (req, res) => {
    try {

        Response(res, 200, config.success_message, null, req.user);
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const updateUserRole = async (req, res) => {
    try {
        const reqBody = req?.body;
        const { _id } = req.user;
        if (reqBody?.userRole == "seller" && reqBody?.shopAddress && reqBody?.shopName && reqBody?.shopMobileNumber) {
            await User.update({ _id: _id }, {
                userRole: reqBody.userRole,
                shopName: reqBody.shopName,
                shopAddress: reqBody.shopAddress,
                shopMobileNumber: reqBody.shopMobileNumber
            })
            Response(res, 200, config.success_message, "Congratulations!,Now you are eligible for seller", null)
        }
        Response(res, 400, config.error_message, "Invalid data", null)

    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
module.exports = {
    login,
    register,
    userProfileDetails
}