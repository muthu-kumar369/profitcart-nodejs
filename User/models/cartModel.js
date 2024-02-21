const mongoose= require("mongoose");

const cartModel=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            quantity:{
                type:Number,
                required:true
            },
            later:{
                type:Boolean,
                required:true,
                default:false
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:false
    },
    totalActualAmount:{
        type:Number,
        required:false
    },
    totalDiscount:{
        type:String,
        required:false
    },
    currency:{
        type:String,
        required:false
    },
    productIds:{
        type:Array,
        required:false,
        ref:'products'
    }
},{timestamps:true});

const Cart = new mongoose.model('cart',cartModel);

module.exports=Cart;