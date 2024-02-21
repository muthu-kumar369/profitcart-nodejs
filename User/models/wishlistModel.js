const mongoose=require('mongoose');

const wishListSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    name:{
        type:String,
        required:true,
        default:"New Folder"
    },
    products:{
        type:Array,
        ref:"products",
        required:false
    },
    status:{
        type:Number,
        required:true,
        default:1
    },
    productIds:{
        type:Array,
        required:false
    }
},{timestamps:true})

const Wishlist=new mongoose.model("wishlist",wishListSchema);

module.exports=Wishlist;