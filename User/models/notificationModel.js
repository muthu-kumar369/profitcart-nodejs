const mogoose=require('mongoose');

const notificationSchema=new mogoose.Schema({
    userId:{
        type:mogoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    type:{
        type:String,
        enum:["order_Status","promotion","offer","info"],
        required:true
    },
    message:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        required:true,
        default:false
    },
    status:{
        type:Number,
        required:true,
        default:1
    },
    productId:{
        type:mogoose.Schema.Types.ObjectId,
        ref:'products',
        required:false
    }
},{timestamps:true});

const Notification=new mogoose.model('notification',notificationSchema);

module.exports=Notification;