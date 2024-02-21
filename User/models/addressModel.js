const mongoose=require('mongoose');

const addressSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    name:{
        type:String,
        required:true
    },
    firstLine:{
        type:String,
        required:true
    },
    secondLine:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    countryCode:{
        type:String,
        required:false
    },
    postalCode:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true,
        default:1
    },
    phone:{
        type:Number,
        required:true
    },
    phoneCode:{
        type:String,
        required:true
    },
    default:{
        type:Boolean,
        required:true,
        default:false
    }
},{timestamps:true})

const Address= new mongoose.model('address',addressSchema);

module.exports=Address;