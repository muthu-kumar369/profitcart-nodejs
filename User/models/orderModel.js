const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"products"
            },
            quantity:{
                type:Number,
                required:true
            },
            status:{
                type:String,
                enum:["ordered","processing","shipped","delivered"],
                required:true,
                default:"ordered"
            },
            orderedDate:{
                type:Date,
                required:true,
                default: new Date()
            },
            deliveryDate:{
                type:Date,
                required:false
            },
            deliveredDate:{
                type:Date,
                required:false
            },
            cancelOrder:{
                type:Boolean,
                required:false,
                default:false
            },
            returnOption:{
                type:String,
                enum:["refund","return"],
                required:false
            },
            cancelStatus:{
                type:String,
                enum:['applied',"accepted"],
                required:false
            },
            returnStatus:{
                type:String,
                enum:["initiated","proccess","completed"],
                required:false
            },
            shippingAddress:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"address"
            },
            returnProduct:{
                type:Boolean,
                required:false,
                default:false
            }
        }
    ],
    
    paymentMethod:{
        type:String,
        required:true
    }
    
},{timestamps:true})

const Order = new mongoose.model('order',orderSchema);

module.exports=Order;