const mongoose = require("mongoose")

const stripeOrdersSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: "products"
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    cartProducts:{
        type:Array,
        required:false
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address"
    }
}, { timestamps: true });

const StripeOrders = mongoose.model("stripeorders", stripeOrdersSchema);

module.exports = StripeOrders;