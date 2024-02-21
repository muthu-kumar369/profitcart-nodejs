const Response=(res,statusCode,status,message,data)=>{
    return res.status(statusCode).json({
        status,
        message,
        data
    })
}

module.exports={
   Response
}