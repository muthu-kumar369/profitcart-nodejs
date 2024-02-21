const Order = require("../models/orderModel.js");
const { Response } = require("../../services/ResponseService.js");
const config = require("../../config.js");
const Products = require("../models/productModel.js");
const mongoose = require("mongoose");
const StripeOrders = require("../models/stripeOrdersModel.js");

const listOrder = async (req, res) => {
    try {
        const { page, size } = req.query;
        const skip = (page - 1) * size;
        const { _id } = req.user;
        await Order.find({ userId: _id }).populate('userId').populate('items.product').populate('items.shippingAddress').skip(skip).limit(size).sort({ createdAt: -1 }).then((order) => {
            if (order.length == 0) {
                Response(res, 200, config.success_message, "No data found", null)
            }
            const data = {
                page,
                size,
                totalCount: order.length,
                order
            }
            Response(res, 200, config.success_message, null, data);
        });
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null);
    }
}

const createOrder = async (req, res) => {
    try {
        const { product, paymentMethod } = req.body;
        const { _id } = req.user;

        await Promise.all(
            product.map(async (item) => {
                const proudctCheck = await Products.findOne({ _id: item.product });
                if (proudctCheck.length == 0) {
                    Response(res, 400, config.error_message, `${item.title} doesn't exist, please remove that`, null)
                }
            })
        )

        if (product.length != 0) {
            await Order.create({
                userId: _id,
                items: product,
                paymentMethod
            }).then(() => {
                Response(res, 200, config.success_message, "Items ordered succuessfully!", null)
            })
        }
    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId, productId, returnOption } = req.body;
        const { _id } = req.user;
        const orderDetails = await Order.findOne({ _id: orderId, "items.product": productId });
        let status = "";
        console.log(orderDetails);
        await Promise.all(
            orderDetails.items.map((item) => {
                if (item.product.toString() == productId) {
                    status = item.status
                }
            })
        )
        if (status == "delivered") {
            await Order.updateOne({ _id: orderId, userId: _id, "items.product": productId }, {
                $set: {
                    "items.$.cancelOrder": true,
                    "items.$.returnOption": returnOption,
                    "items.$.cancelStatus": "applied",
                    "items.$.returnStatus": "initiated"
                }
            }).then(() => {
                Response(res, 400, config.success_message, "Cancel orderd intiated, we will let you know progress", null)
            })
        } else {
            Response(res, 400, config.success_message, "Order doesn't delivered yet", null)
        }

    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const updateAddress = async (req, res) => {
    try {
        const { orderId, productId, shippingAddress } = req.body;
        const { _id } = req.user;
        const orderDetails = await Order.findOne({ _id: orderId, "items.product": productId });
        let status = "";

        await Promise.all(
            orderDetails.items.map((item) => {
                if (item.product.toString() == productId) {
                    status = item.status
                }
            })
        )
        if (!(status == "shipped" || status == "delivered")) {
            await Order.updateOne({ _id: orderId, userId: _id, "items.product": productId }, {
                $set: {
                    'items.$.shippingAddress': shippingAddress
                }
            }).then(() => {
                Response(res, 200, config.success_message, "Address updated successfully", null)
            })
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const createBulkOrder = async (req, res) => {
    try {
        const { id } = req.body;
        const { _id } = req.user;
        let orderItems=[];
        let getStripeOrder = await StripeOrders.findOne({ _id: id, userId: _id }).populate("items.$.product");
        if (getStripeOrder) {
            await Promise.all(
                getStripeOrder?.items.map(async (item) => {
                    const proudctCheck = await Products.findOne({ _id: item?.product });
                    if (proudctCheck.length == 0) {
                        Response(res, 400, config.error_message, `${item.title} doesn't exist, please remove that`, null)
                    }
                })
            )
            getStripeOrder = await StripeOrders.findOne({ _id: id, userId: _id });
            getStripeOrder.items.map((item) => {
                let data={
                    product:item?.product,
                    quantity:item?.quantity,
                    shippingAddress:getStripeOrder.addressId
                }
                orderItems.push(data);
            })
            if (orderItems.length != 0) {
                await Order.create({
                    userId: _id,
                    items: orderItems,
                    paymentMethod: "card"
                }).then(() => {
                    Response(res, 200, config.success_message, "Items ordered succuessfully!", null)
                })
            }else{
                Response(res,400,config.error_message,"Product didn't get to order",null);
            }
        }else{
            Response(res,400,config.error_message,"Stripe order not available",null);
        }
    } catch (error) {
        Response(res,400,config.error_message,error?.message ?? error,null)
    }
}
module.exports = {
    listOrder,
    createOrder,
    cancelOrder,
    updateAddress,
    createBulkOrder
}
