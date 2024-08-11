const { Response } = require('../../services/ResponseService.js');
const config = require("../../config.js");
const Products = require('../models/productModel.js');
const User = require('../models/userModel.js');
const Address = require('../models/addressModel.js');
const StripeOrders = require('../models/stripeOrdersModel.js');
const stripe = require('stripe')(process.env.Stripe_key);

const addProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const products = await Products.find({ _id: productId });
        console.log(products[0].stripeId);
        if (products[0]?.stripeId == null || products[0]?.stripeId == undefined) {
            const productPromise = products.map(async (product, index) => {
                if (product) {
                    let price = product.selling_price.split(",").join("");
                    price = Number(price);
                    const stripeProduct = await stripe.products.create({
                        description: product?.description || "description",
                        images: product.images.slice(0, 7),
                        name: product?.title || "title",
                        shippable: true,
                        metadata: {
                            productId: product._id
                        }
                    });
                    await Products.updateOne({ _id: product._id }, {
                        $set: {
                            stripeId: stripeProduct.id
                        }
                    })
                    const prices = await stripe.prices.create({
                        currency: "inr",
                        unit_amount: price * 100 || 0,
                        product: stripeProduct.id
                    });

                    await stripe.products.update(stripeProduct.id, {
                        default_price: prices.id
                    });
                }
            })
            await Promise.all(productPromise).then(() => {
                Response(res, 200, config.success_message, "Product added successfully", null);
            })
        } else {
            Response(res, 200, config.success_message, "Product already exist", null);
        }

        // const product= await stripe.prices.list({limit:100});
        // console.log(product.data.length);
        // await Promise.all(  
        //     product.data.map(async(item)=>{
        //         await stripe.prices.update(item.id,{
        //             unit_amount:item.unit_amount*100
        //         })
        //     })
        // ).then(()=>{
        //     Response(res,200,config.success_message,"Product added successfully",null);
        // })
    } catch (error) {
        console.log(error?.error_message);
        Response(res, 400, config.error_message, error?.error_message ?? error, null)
    }
}

const retrievePriceDetails = async (req, res) => {
    try {
        const { productIds, type } = req.body;
        const { _id } = req.user;
        let data = [];
        let productItems = [];
        await StripeOrders.updateOne({ userId: _id }, {
            $pullAll: {
                items:[],
                cartProducts:[]
            }
        })
        const productPromise = productIds.map(async (item,index) => {
            const productDetails = await Products.findOne({ _id: item?.id });
            let stripeOrderData={
                product:item?.id,
                quantity:item?.quantity,
            };
            if(type=="charge" && index==0){
                stripeOrderData.price=item?.price-40;
            }else{
                stripeOrderData.price=item?.price
            }
            productItems.push(stripeOrderData);
            if (productDetails?.stripeId != null || productDetails?.stripeId != undefined) {
                const stripeProduct = await stripe.products.retrieve(productDetails?.stripeId).catch((err) => {
                    console.log(err?.message);
                });
                if (stripeProduct) {
                    let details = {
                        price: stripeProduct?.default_price,
                        quantity: item?.quantity
                    };
                    data.push(details);
                } else {

                    const stripeProduct = await stripe.products.create({
                        description: productDetails?.description || "description",
                        images: productDetails.images.slice(0, 7),
                        name: productDetails?.title || "title",
                        shippable: true,
                        metadata: {
                            productId: productDetails._id
                        }
                    });
                    // if(type && type!="charge"){
                    //     await Products.updateOne({ _id: productDetails._id }, {
                    //         $set: {
                    //             stripeId: stripeProduct.id
                    //         }
                    //     })
                    // }
                    const prices = await stripe.prices.create({
                        currency: "inr",
                        unit_amount: item?.price * 100 || 0,
                        product: stripeProduct.id
                    });

                    await stripe.products.update(stripeProduct.id, {
                        default_price: prices.id
                    });

                    let details = {
                        price: prices.id,
                        quantity: item.quantity
                    }
                    data.push(details);
                }

            } else {
                if (productDetails) {
                    const stripeProduct = await stripe.products.create({
                        description: productDetails?.description || "description",
                        images: productDetails.images.slice(0, 7),
                        name: productDetails?.title || "title",
                        shippable: true,
                        metadata: {
                            productId: productDetails._id
                        }
                    });
                    // if(type && type!="charge"){
                    //     await Products.updateOne({ _id: productDetails._id }, {
                    //         $set: {
                    //             stripeId: stripeProduct.id
                    //         }
                    //     })
                    // }
                    const prices = await stripe.prices.create({
                        currency: "inr",
                        unit_amount: item?.price * 100 || 0,
                        product: stripeProduct.id
                    });

                    await stripe.products.update(stripeProduct.id, {
                        default_price: prices.id
                    });

                    let details = {
                        price: prices.id,
                        quantity: item.quantity
                    }
                    data.push(details);
                }
            }
        })
        await Promise.all(productPromise).then(async () => {
            const getStripeOrders = await StripeOrders.findOne({ userId: _id });
            if (getStripeOrders) {
                await StripeOrders.updateOne({ userId: _id }, {
                    items:productItems
                }).then(() => {
                    Response(res, 200, config.success_message, null, data)
                })
            }else{
                await StripeOrders.create({ userId: _id,items:productItems }).then(() => {
                    Response(res, 200, config.success_message, null, data)
                })
            }


        })
    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
const createSession = async (req, res) => {
    try {
        const { pricingDetails,addressId,cartProducts } = req.body;
        const { _id, email, name, stripeCustomerId } = req.user;
        
        req.body?.addressId ?   null :Response(res, 400, config.error_message,"Please add or select address", null);
        const addressDetails = await Address.findOne({_id:addressId, userId: _id });
        const { city, country, postalCode, state, firstLine } = addressDetails;
        const stripeOrders = await StripeOrders.findOne({ userId: _id });
        await StripeOrders.updateOne({_id:stripeOrders._id},{
            addressId,
            cartProducts
        })
        if (stripeCustomerId) {
            const session = await stripe.checkout.sessions.create({
                line_items: pricingDetails,
                customer: stripeCustomerId,
                mode: "payment",
                success_url: `${process.env.domain}/payment/success?id=${stripeOrders._id}`,
                cancel_url: `${process.env.domain}/payment/failed`
            });

            Response(res, 200, config.success_message, null, session);
        } else {
            const customer = await stripe.customers.create({
                name,
                email,
                address: {
                    line1: firstLine,
                    postal_code: postalCode,
                    city,
                    state,
                    country
                }
            })

            await User.updateOne({ _id }, {
                $set: {
                    stripeCustomerId: customer.id
                }
            });

            const session = await stripe.checkout.sessions.create({
                line_items: pricingDetails,
                customer: customer.id,
                mode: "payment",
                success_url: `${process.env.domain}/payment/success?id=${stripeOrders._id}`,
                cancel_url: `${process.env.domain}/payment/failed`
            });

            Response(res, 200, config.success_message, null, session);
        }



    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}
module.exports = {
    addProduct,
    retrievePriceDetails,
    createSession
}


