const mongoosee=require('mongoose');

const reviewSchema=new mongoosee.Schema({
    userId:{
        type:mongoosee.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    productId:{
        type:mongoosee.Schema.Types.ObjectId,
        required:true,
        ref:"products"
    },
    rating:{
        type:Number,
        required:true
    },
    reviewText:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true,
        default:1
    }
},{timestamps:true});


const Review=new mongoosee.model('review',reviewSchema);

module.exports=Review;