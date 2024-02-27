const { Response } = require("../../services/ResponseService")
const config=require("../../config.js");
const Address = require("../models/addressModel.js");

const listAddress=async(req,res)=>{
    try {
        const {page,size}=req.query;
        const {_id}=req.user;
        const skip=(page-1)*size;

        await Address.find({userId:_id,status:1}).skip(skip).limit(size).sort({createdAt:-1}).then((address)=>{
            if(address.length==0){
                Response(res,200,config.success_message,"No data found",{address:[]})
            }else{
                let data={
                    page,
                    size,
                    totalLength:address.length,
                    address
                };
                Response(res,200,config.success_message,null,data)
            }
            
        })
    } catch (error) {
        console.log(error);
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}

const createAddress=async(req,res)=>{
    try {
        const {_id}=req.user;
        req.body.userId=_id;
        const getAddress=await Address.find({userId:_id,status:1});
        getAddress.length==0
        if(getAddress.length==0){
            req.body.default=true;
        }
        await Address.create(req.body).then(()=>{
            Response(res,200,config.success_message,"Address added successfully", null)
        })
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}

const updateAddress=async(req,res)=>{
    try {
        const {addressId,name,firstLine,secondLine,country,countryCode,postalCode,phone,phoneCode,city,state}=req.body;
        const {_id}=req.user;
        console.log(req.body);
        const getAddressDetails=await Address.findOne({_id:addressId,status:1});
        console.log(getAddressDetails);
        await Address.updateOne({_id:addressId,userId:_id},{
            name,
            firstLine,
            secondLine,
            country,
            countryCode,
            postalCode,
            city,
            state,
            phone,
            phoneCode
        }).then(()=>{
            Response(res,200,config.success_message,"Address updated successfully",null)
        })
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}

const removeAddress=async(req,res)=>{
    try {
        const {_id}=req.user;

        await Address.updateOne({_id:req.params.id,userId:_id},{ status:0}).then(()=>{
            Response(res,200,config.success_message,"Address removed successfully",null)
        })
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null);
    }
}

const updateDefaultAddress=async(req,res)=>{
    try {
        const {_id}=req.user;
        const defaultAddress=await Address.findOne({userId:_id,default:true});
        if(defaultAddress){
            await Address.updateOne({_id:defaultAddress._id,userId:_id},{default:false});
        } 
        await Address.updateOne({_id:req.params.id,userId:_id},{ default:true}).then(()=>{
            Response(res,200,config.success_message,"Address Changes as default",null)
        })
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}
module.exports={
    listAddress,
    createAddress,
    updateAddress,
    removeAddress,
    updateDefaultAddress
}