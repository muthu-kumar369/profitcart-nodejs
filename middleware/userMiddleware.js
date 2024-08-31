const jwt = require("jsonwebtoken");
const User = require("../User/models/userModel");
const { Response } = require("../services/ResponseService");
const config=require("../config.js");

const userAuth = async (req, res, next) => {
    console.log("I am in")
    try {
        const token = req.headers["x-access-token"] || req.headers['Authorization'] || req.headers['authorization'];
        if (token) {
            jwt.verify(token,process.env.security_key, async function(err,decode){
                if(!err){
                    const userDetails=await User.findOne({email:decode.email});
                    req.user=userDetails;
                    next();
                } else{
                    Response(res,400,config.error_message,"Token is not valid",null)
                }
            })
        }else{
            Response(res,400,config.error_message,"Token is required!",null)
        }
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}

module.exports=userAuth;