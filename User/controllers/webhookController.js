const { Response } = require("../../services/ResponseService")
const config = require('../../config.js');

const endpointSecret = "whsec_45065a3eb49f6a4e9c6231e0e0f7a26a79637ecf8304f5252f6bc89d557a9fa9";

const orderComplete=async(event)=>{
    try {
        
    } catch (error) {
        console.log(error);
    }
}
const webhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];

        let event;

        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);


        switch (event.type) {
            case 'checkout.session.completed':
                orderComplete(event);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

module.exports = {
    webhook
}