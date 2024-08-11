const { Response } = require("../../services/ResponseService")
const config = require('../../config.js');
const Cart = require("../models/cartModel");
const Products = require("../models/productModel.js");
const StripeOrders = require("../models/stripeOrdersModel.js");

const listCart = async (req, res) => {
    try {
        const { page, size } = req.query;
        const skip = (page - 1) * size;
        const { _id } = req.user;

        const cartDetails = await Cart.find({ userId: _id, 'items.later': false }).populate('userId').populate('items.product').skip(skip).limit(size).sort({ "items.createdAt": -1 });

        const buylaterDetails = await Cart.find({ userId: _id, 'items.later': true }).populate('userId').populate('items.product').skip(skip).limit(size).sort({ createdAt: -1 });

        if (cartDetails[0]?.items?.length <= 0 && buylaterDetails[0].items?.length <= 0) {
            Response(res, 200, config.success_message, "No data found", null)
        } else {
            let data = {
                cart: {
                    page,
                    size,
                    data: cartDetails,
                    totalPage: 1
                },
                buylater: {
                    page,
                    size,
                    data: buylaterDetails,
                    totalPage: 1
                }
            }
            let cartTotalPage = parseInt(cartDetails[0]?.items?.length / 5);
            let cartDecimal = cartDetails[0]?.items?.length % 5;
            if (cartDecimal > 0) {
                cartTotalPage++;
            }
            data.cart.totalPage = data.cart.totalPage <= cartTotalPage ? cartTotalPage : data.cart.totalPage;

            let buylaterTotalPage = parseInt(buylaterDetails[0]?.items?.length / 5);
            let decimal = buylaterDetails[0]?.items?.length % 5;
            if (decimal > 0) {
                buylaterTotalPage++;
            }
            let priceDetails = [];
            const pricePromise = cartDetails[0]?.items.map((item) => {
                let data = {}
                if (!item.later) {
                    data.id = item?.product?._id;
                    data.quantity = item?.quantity;
                    let amount = item?.product?.selling_price.split(',').join("");
                    data.price = Number(amount);
                    data.title = item?.product?.title;
                    data.cartId = item?._id;
                    priceDetails.push(data);
                }

            })
            data.cart.priceDetails = priceDetails;
            data.buylater.totalPage = data.buylater.totalPage <= buylaterTotalPage ? buylaterTotalPage : data.buylater.totalPage;
            Response(res, 200, config.success_message, null, data);
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null);
    }
}

// const listOfBuyLater= async(req, res)=>{
//     try {
//         const {page,size}=req.query;
//         const {_id}=req.user;
//         const skip=(page-1)*size;

//         await Cart.find({userId:_id,'items.later':true}).populate('userId').populate('items.product').skip(skip).limit(size).then((cart)=>{
//             const data={
//                 page,
//                 size,
//                 totalLength:cart.length,
//                 cart
//             }
//             Response(res,200,config.success_message,null,data)
//         })
//     } catch (error) {
//         console.log(error);
//         Response(res,400,config.error_message,error?.message ?? error,null)
//     }
// }

const addProduct = async (req, res) => {
    try {
        const { productId, quantity, currency } = req.body;
        const { _id } = req.user;
        var { amount, actual_amount } = req.body;
        amount = amount.split(',').join("");
        actual_amount = actual_amount.split(',').join("");
        let totalDiscount;

        const cartDetails = await Cart.findOne({ userId: _id });
        const productDetails = await Products.findOne({ _id: productId });

        const product = {
            product: productId,
            quantity,
        };
        if (cartDetails?.totalAmount) {
            amount = cartDetails?.totalAmount + parseInt(amount);
        }
        if (cartDetails?.totalActualAmount) {
            actual_amount = cartDetails?.totalActualAmount + parseInt(actual_amount);
        }
        if (amount && actual_amount) {

            totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
            totalDiscount = `${totalDiscount}% off`
        }

        if (productDetails.length != 0) {
            if (!cartDetails) {
                await Cart.create({
                    userId: _id,
                    items: [
                        product
                    ],
                    totalAmount: amount,
                    totalActualAmount: actual_amount,
                    totalDiscount,
                    currency: currency,
                    $push: {
                        productIds: productId
                    }
                }).then(async (result) => {

                    Response(res, 200, config.success_message, "Product added to cart!", null)
                })
            } else {
                await Cart.updateOne({ _id: cartDetails._id }, {
                    $push: {
                        items: product,
                        productIds: productId
                    },
                    totalAmount: amount,
                    totalActualAmount: actual_amount,
                    totalDiscount,
                }).then(async () => {

                    Response(res, 200, config.success_message, "Product added to cart", null)
                }).catch(err => console.log(err))
            }
        } else {
            Response(res, 400, config.error_message, "Product doesn't exist!", null)
        }

    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const removeProduct = async (req, res) => {
    try {
        const { id, productId } = req.body;
        var { amount, actual_amount } = req.body;
        amount = amount.split(',').join("");
        actual_amount = actual_amount.split(',').join("");

        const { _id } = req.user;
        const cartDetails = await Cart.findOne({ userId: _id });

        amount = cartDetails?.totalAmount - parseInt(amount);
        actual_amount = cartDetails?.totalActualAmount - parseInt(actual_amount);
        let totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
        totalDiscount = `${totalDiscount}% off`;

        await Cart.updateOne({ userId: _id }, {
            $pull: {
                items: {
                    _id: id
                },
                productIds: productId
            },
            totalAmount: amount,
            totalActualAmount: actual_amount,
            totalDiscount
        }).then(() => {
            Response(res, 200, config.success_message, "Product removed from cart", null)
        })
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const removeOrderedProducts = async (req, res) => {
    try {
        const { products, type, stripeOrderId } = req.body;
        const { _id } = req.user;

        var productData = [];
        const stripeOrderedData = await StripeOrders.findOne({ _id: stripeOrderId, userId: _id });
        console.log(stripeOrderedData);
        switch (type) {
            case "card":
                productData = stripeOrderedData?.cartProducts;
                break;
            case "cashondelivery":
                productData = products
                break;
        }
        console.log(productData);
        const removePromise = productData.map(async (item) => {
            const cartDetails = await Cart.findOne({ userId: _id });
            const productDetails = await Products.findOne({ _id: item.id });
            let amount = productDetails.selling_price.split(',').join("");
            let actual_amount = productDetails.actual_price.split(',').join("");

            amount = cartDetails?.totalAmount - parseInt(amount);
            actual_amount = cartDetails?.totalActualAmount - parseInt(actual_amount);
            let totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
            totalDiscount = `${totalDiscount}% off`;

            await Cart.updateOne({ userId: _id }, {
                $pull: {
                    items: {
                        _id: item?.cartId
                    },
                    productIds: item.id
                },
                totalAmount: amount,
                totalActualAmount: actual_amount,
                totalDiscount
            })
        })

        await Promise.all(removePromise).then(() => {
            Response(res, 200, config.success_message, "Product removed from cart", null)
        })
    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
const updateLater = async (req, res) => {
    try {
        const { id, type } = req.body;
        const { _id } = req.user;
        var { amount, actual_amount } = req.body;
        amount = amount.split(',').join("");
        actual_amount = actual_amount.split(',').join("");
        const cartDetails = await Cart.findOne({ userId: _id });
        let totalDiscount;
        switch (type) {
            case 'buylater':
                amount = cartDetails?.totalAmount - parseInt(amount);
                actual_amount = cartDetails?.totalActualAmount - parseInt(actual_amount);
                totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
                totalDiscount = `${totalDiscount}% off`;
                await Cart.updateOne({ userId: _id, "items._id": id }, {
                    $set: {
                        "items.$.later": true,
                        totalAmount: amount,
                        totalActualAmount: actual_amount,
                        totalDiscount
                    }
                }).then(() => {
                    Response(res, 200, config.success_message, "Save for later updated", null)
                })
                break;
            case 'cart':
                amount = cartDetails?.totalAmount + parseInt(amount);
                actual_amount = cartDetails?.totalActualAmount + parseInt(actual_amount);
                totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
                totalDiscount = `${totalDiscount}% off`;

                await Cart.updateOne({ userId: _id, "items._id": id }, {
                    $set: {
                        "items.$.later": false,
                        totalAmount: amount,
                        totalActualAmount: actual_amount,
                        totalDiscount
                    }
                }).then(() => {
                    Response(res, 200, config.success_message, "Save for later updated", null)
                })
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const quantityUpdate = async (req, res) => {
    try {
        const { productId, quantity, type } = req.body;
        const { _id } = req.user;
        var { amount, actual_amount } = req.body;
        amount = amount.split(',').join("");
        actual_amount = actual_amount.split(',').join("");

        const cartDetails = await Cart.findOne({ userId: _id });
        let totalDiscount;

        switch (type) {
            case "add":
                amount = cartDetails?.totalAmount + parseInt(amount);
                actual_amount = cartDetails?.totalActualAmount + parseInt(actual_amount);
                totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
                totalDiscount = `${totalDiscount}% off`;
                await Cart.updateOne({ userId: _id, "items.product": productId }, {
                    $set: {
                        "items.$.quantity": quantity,
                        totalAmount: amount,
                        totalActualAmount: actual_amount,
                        totalDiscount
                    }
                }).then(() => {
                    Response(res, 200, config.success_message, "Quantity count Updated", null)
                })
                break;
            case "reduce":
                amount = cartDetails?.totalAmount - parseInt(amount);
                actual_amount = cartDetails?.totalActualAmount - parseInt(actual_amount);
                totalDiscount = parseInt(((actual_amount - amount) / actual_amount) * 100);
                totalDiscount = `${totalDiscount}% off`;
                await Cart.updateOne({ userId: _id, "items.product": productId }, {
                    $set: {
                        "items.$.quantity": quantity,
                        totalAmount: amount,
                        totalActualAmount: actual_amount,
                        totalDiscount
                    }
                }).then(() => {
                    Response(res, 200, config.success_message, "Quantity count Updated", null)
                })
                break;
        }
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
module.exports = {
    listCart,
    // listOfBuyLater,
    addProduct,
    removeProduct,
    updateLater,
    quantityUpdate,
    removeOrderedProducts
}