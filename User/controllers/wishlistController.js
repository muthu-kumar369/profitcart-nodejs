const { Response } = require('../../services/ResponseService.js');
const config = require('../../config.js');
const Wishlist = require('../models/wishlistModel.js');
const Products = require("../models/productModel.js");

const getWishlist = async (req, res) => {
    try {
        const { page, size } = req.query;
        const skip = (page - 1) * size;
        const { _id } = req.user;

        const wishListData=await Wishlist.find({ userId: _id,status:1 }).populate("products").skip(skip).limit(size).sort({ createdAt: -1 })
        let productIds=[]
        if(wishListData){
            await wishListData.map((items)=>{
                items?.productIds.map((item)=>{
                    productIds.push(item)
                })
            })
    
            Response(res, 200, config.success_message, null, {
                data:wishListData,
                productIds
            })
        }else{
            Response(res, 200, config.success_message, null, {
                data:[],
                productIds:[]
            })
        }
        

    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const { _id } = req.user;

        await Wishlist.create({
            userId: _id,
            name
        }).then(() => {
            Response(res, 200, config.success_message, "Folder created successfully", null)
        })
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const updateFolder = async (req, res) => {
    try {
        const { name, id } = req.body;
        const { _id } = req.user;
        let folderStatus = false;


        await Wishlist.findOne({ _id: id }).then((data) => {
            if (data) {
                folderStatus = true
            }
        })
        if (folderStatus) {
            await Wishlist.updateOne({ _id: id, userId: _id }, {
                $set: {
                    name
                }
            }).then(() => {
                Response(res, 200, config.success_message, "Folder updated successfully", null)
            })
        } else {
            if (!folderStatus) {
                Response(res, 400, config.error_message, "Folder not available", null)
            }
        }

    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const removeFolder=async(req,res)=>{
    try {
        const {id } = req.body;
        const { _id } = req.user;
        let folderStatus = false;
        let productId=[];

        await Wishlist.findOne({ _id: id }).then((data) => {
            productId=data.products;
            if (data) {
                folderStatus = true
            }
        })
        if (folderStatus) {
            await Wishlist.updateOne({ _id: id, userId: _id }, {
                $set: {
                    status:0
                },
                $pull:{
                    productIds:productId
                }
            }).then(() => {
                Response(res, 200, config.success_message, "Folder removed succuessfully", null)
            })
        }else{
            if (!folderStatus) {
                Response(res, 400, config.error_message, "Folder not available", null)
            }
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
 }

const addProduct = async (req, res) => {
    try {
        const { productId, id } = req.body;
        const { _id } = req.user;

        let productStatus = false, folderStatus = false;

        await Products.findOne({ _id: productId }).then((data) => {
            if (data) {
                productStatus = true
            }
        })
        await Wishlist.findOne({ _id: id }).then((data) => {
            if (data) {
                folderStatus = true
            }
        })
        if (productStatus && folderStatus) {
            await Wishlist.updateOne({ _id: id, userId: _id }, {
                $push: {
                    products: productId,
                    productIds:productId
                }
            });

            Response(res, 200, config.success_message, "Product added to wishlist", null)
        } else {
            if (!productStatus) {
                Response(res, 400, config.error_message, "Product not available", null)
            }
            if (!folderStatus) {
                Response(res, 400, config.error_message, "Folder not available", null)
            }
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const removeProduct=async(req,res)=>{
    try {
        const { productId, id } = req.body;
        const { _id } = req.user;

        let productStatus = false, folderStatus = false;

        await Products.findOne({ _id: productId }).then((data) => {
            if (data) {
                productStatus = true
            }
        })
        await Wishlist.findOne({ _id: id }).then((data) => {
            if (data) {
                folderStatus = true
            }
        })
        if (productStatus && folderStatus) {
            await Wishlist.updateOne({ _id: id, userId: _id }, {
                $pull: {
                    products: productId,
                    productIds:productId
                }
            });
            Response(res, 200, config.success_message, "Product Removed from wishlist", null)
        } else {
            if (!productStatus) {
                Response(res, 400, config.error_message, "Product not available", null)
            }else if (!folderStatus) {
                Response(res, 400, config.error_message, "Folder not available", null)
            }
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
 }

 module.exports={
    getWishlist,
    createFolder,
    addProduct,
    updateFolder,
    removeProduct,
    removeFolder
 }