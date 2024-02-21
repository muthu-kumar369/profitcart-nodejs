const { boolean } = require('joi');
const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    pid:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:false
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:false
    },
    actual_price:{
        type:String,
        required:true
    },
    selling_price:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    average_rating:{
        type:String,
        required:false
    },
    discount:{
        type:String,
        required:false
    },
    out_of_stock:{
        type:Boolean,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    product_details:{
        type:Array,
        required:true
    },
    seller:{
        type:String,
        required:true
    },
    sub_category:{
        type:String,
        required:false
    },
    stripeId:{
        type:String,
        required:false
    }
},{timestamps:true});

const Products=new mongoose.model("products",productSchema);

module.exports=Products;