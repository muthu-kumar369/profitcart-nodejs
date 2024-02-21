const mongoose=require("mongoose");
const Schema= require("mongoose").Schema;

const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    userRole:{
        type:String,
        enum:["user","seller","admin"],
        default:"user"
    },
    token:{
        type:String,
        required:false
    },
    lastLogin:{
        type:Date,
        required:false
    },
    currentOrder:{
        type:Number,
        required:true,
        default:0
    },
    returnedCount:{
        type:Number,
        required:true,
        default:0
    },
    stripeCustomerId:{
        type:String,
        required:false
    }

},{timestamps:true});

const User = new mongoose.model("user",userSchema);

module.exports=User;
