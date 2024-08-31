const joi = require("joi");

const Schemas = {
    address: joi.object({
        name: joi.string(),
        firstLine: joi.string(),
        secondLine: joi.string(),
        country: joi.string(),
        countryCode: joi.string(),
        postalCode: joi.string(),
        city: joi.string(),
        state: joi.string(),
        phone: joi.number(),
        phoneCode: joi.string(),
        addressId: joi.string().length(24)
    }),
    cart: joi.object({
        productId: joi.string().length(24),
        id: joi.string().length(24),
        quantity: joi.number(),
        amount: joi.string(),
        currency: joi.string(),
        actual_amount: joi.string(),
        products: joi.array().items(joi.object({
            id: joi.string().length(24).required("Product id is required to remove"),
            quantity: joi.number(),
            price: joi.number(),
            title: joi.string(),
            cartId: joi.string().length(24).required("Cart id is required to remove")
        })),
        type: joi.string()
    }),
    notification: joi.object({
        id: joi.array(),
        type: joi.string().valid("order_Status", "promotion", "offer", "info"),
        message: joi.string()
    }),
    order: joi.object({
        id: joi.string().length(24),
        product: joi.array().items(
            joi.object({
                product: joi.string().length(24).required("Product id is requried for order"),
                quantity: joi.number().required("Quantity is requied for order"),
                title: joi.string()
            })
        ),
        shippingAddress: joi.string().length(24),
        paymentMethod: joi.string(),
        orderId: joi.string().length(24),
        productId: joi.string().length(24),
        returnOption: joi.string().valid("refund", "return")
    }),
    review: joi.object({
        productId: joi.string().length(24),
        rating: joi.number(),
        reviewText: joi.string(),
        reviewId: joi.string().length(24)
    }),
    user: joi.object({
        name: joi.string(),
        password: joi.string(),
        email: joi.string().email().message({
            'string.email': `Email is not valid`
        }),
        userRole: joi.string().valid("user", "seller", "admin")
    }),
    wishlist: joi.object({
        name: joi.string(),
        productId: joi.string().length(24),
        id: joi.string().length(24)
    }),

}

module.exports = Schemas;