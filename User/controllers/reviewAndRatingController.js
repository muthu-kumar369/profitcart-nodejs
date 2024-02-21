const { Response } = require("../../services/ResponseService")
const config=require('../../config.js');
const Review = require("../models/reviewAndRatingModel");
const Products = require("../models/productModel.js");

const getReview= async(req,res)=>{
    let flag=true;
    try {
        const {productId}=req.body;
        const {page,size}=req.query;
        const skip=(page-1)*size;
        
        await Review.find({productId,status:1}).populate('userId').skip(skip).limit(size).then((review)=>{
            if(review.length==0 || review.length == null){
                flag=false;
                Response(res,200,config.success_message,"No data found!",null)
            }
            let data={
                page,
                size,
                totalLength:review.length,
                review
            }
            Response(res,200,config.success_message,null,data)
        })
    } catch (error) {
       flag ? Response(res,400,config.error_message,error?.error_message ?? error, null) : null;
    }
}

const createReview=async(req,res)=>{
    let flag=true;
    try {
        const {productId,rating,reviewText}=req.body;
        const {_id}=req.user;
        const productDetails= await Products.find({_id:productId});
        if(productDetails.length==0 || productDetails.length==null){
            flag=false;
            Response(res,400,config.error_message,"Product doesn't exist",null)
        }
        await Review.create({
            userId:_id,
            productId,
            rating,
            reviewText
        }).then(()=>{
            Response(res,200,config.success_message,"Review added successfully",null )
        })
    } catch (error) {
       flag ?  Response(res,400,config.error_message,error?.message ?? error,null):  null;
    }
}

const updateReview=async(req,res)=>{
    let flag=true;
    try {
        const {reviewId,reviewText,rating}=req.body;
        const {_id}=req.user;
        const reviewDetails= await Review.find({_id:reviewId,userId:_id});
        if(reviewDetails.length!=0 && reviewDetails.length!=null){
            await Review.updateOne({_id:reviewId,userId:_id},{
               $set:{
                reviewText,
                rating
               }
            }).then(()=>{
                Response(res,200,config.success_message,"Review updated successfully",null)
            })
        }else{
            flag=fasle;
            Response(res,400,config.error_message,"Review doesn't exist",null)
        }
    } catch (error) {
        flag ? Response(res,400,config.error_message,error?.message ?? error, null): null;
    }
}

const removeReview=async(req,res)=>{
    let flag=true;
    try {
        const {reviewId}=req.body;
        const {_id}=req.user;

        const reviewDetails= await Review.find({_id:reviewId});
        if(reviewDetails.length!=0 && reviewDetails.length!=null){
            await Review.updateOne({_id:reviewId,userId:_id},{
                status:0
            }).then(()=>{
                flag=false;
                Response(res,200,config.success_message,"Review removed successfully",null)
            })
        }else{
            Response(res,400,config.error_message,"Review doesn't exist",null)
        }
    } catch (error) {
        flag ? Response(res,400,config.error_message,error?.message ?? error, null) : null;
    }
}

module.exports={
    getReview,
    createReview,
    updateReview,
    removeReview
}