
const {Response}=require('../../services/ResponseService.js');
const config=require('../../config.js');
const Notification = require('../models/notificationModel.js');

const getNotification= async(req,res)=>{
    try {
        const {page,size,type}=req.query;
        const {_id}=req.user;
        const skip=(page-1)*size;
        let data={
            page,
            size
        }
        switch (type) {
            case "unread":
                const unread= await Notification.find({userId:_id,read:false,status:1}).populate("productId").skip(skip).limit(size).sort({createdAt:-1});
                if(unread.length!=0){
                    data.totalLength=unread.length;
                    data.notification=unread;
                }
                break;
            case "all":
                const all=await Notification.find({userId:_id,read:false}).skip(skip).limit(size).sort({createdAt:-1});
                if(all.length!=0){
                    data.totalLength=all.length;
                    data.notification=all;
                }
                break
            default:
                break;
        }
        if(data?.totalLength==0 || data?.totalLength==null){
            Response(res,200,config.success_message,"No data found", null)
        }else{
            Response(res,200,config.success_message,null,data);
        }
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error,null)
    }
}

const createNotification=async(req,res)=>{
    try {
        const {type,message}=req.body;
        const {_id}=req.user;

        await Notification.create({
            userId:_id,
            type,
            message
        }).then(()=>{
            Response(res,200,config.success_message,"Notification created successfully",null)
        })
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error, null)
    }
}
const updateRead=async(req,res)=>{
    let flag=true;
    try {
        const {id}=req.body;
        const {_id}=req.user;
        await Promise.all(
            id.map(async(id)=>{
               let notificationDetails= await Notification.find({_id:id});
               if(notificationDetails.length==0 || notificationDetails?.length==null){
                    flag=false;
                    Response(res,400,config.error_message,"Notificaiton not exist",null);
               }
            })
        )
        await Notification.updateMany({_id:id,userId:_id},{
            $set:{
                read:true
            }
        }).then(()=>{
            Response(res,200,config.success_message,"Read updated successfully",null)
        })
    } catch (error) {
        
        flag ? Response(res,200,config.error_message,error?.message ?? error,null) : null;
    }
} 

const removeNotification=async(req,res)=>{
    let flag=true;
    try {
        const {id}=req.body;
        const {_id}=req.user;

        await Promise.all(
            id.map(async(id)=>{
                let notificationDetails=await Notification.find({_id:id});
                if(notificationDetails?.length==0 || notificationDetails?.length==null){
                    flag=false;
                    Response(res,400,config.error_message,"Notification doesn't exist",null)
                }
            })
        );

        await Notification.updateMany({_id:id,userId:_id},{
            $set:{
                status:0
            }
        }).then(()=>{
            Response(res,200,config.success_message,"Message deleted successfully",null)
        })
    } catch (error) {
        flag ? Response(res,200,config.error_message,error?.message ?? error,null) : null;
    }
}

module.exports={
    getNotification,
    createNotification,
    updateRead,
    removeNotification
}