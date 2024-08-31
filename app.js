const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require("dotenv");
const cors = require('cors');
const os = require("os");
const helmet = require("helmet");

//configure the dotenv
dotenv.config();

//routers
const userRoutes = require("./User/routes/userRoutes.js");
const productRoutes = require("./User/routes/productRoutes.js");
const cartRoutes = require('./User/routes/cartRoutes.js');
const orderRoutes = require('./User/routes/orderRoutes.js');
const addressRoutes = require('./User/routes/addressRoutes.js');
const notificationRoutes = require('./User/routes/notificationRoutes.js');
const reviewRoutes = require('./User/routes/reviewAndRatingRoutes.js');
const stripeRouter = require('./User/routes/stripeRoutes.js');
const webhookRouter = require('./User/routes/webhookRouter.js');
const wishlistRouter = require("./User/routes/wishlistRoutes.js");

//connect mongodb database
mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Datbase connected !");
    app.listen(process.env.port || 4000, (err) => {
        console.log(err);
    });
    console.log(`Server listening on ${process.env.port || 4000}`);
})

//using middleware for express app
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan('dev'));

//configure helmet for security
app.use(helmet({
    //disable content policy help to prevent XSS attack
    contentSecurityPolicy: false,

    //prevent MIME type which is not included in content-type header
    noSniff: true,
    
    //prevent information disclousure
    hidePoweredBy: true
}))

//app routes
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/address', addressRoutes);
app.use('/notification', notificationRoutes);
app.use('/review', reviewRoutes);
app.use('/stripe', stripeRouter);
app.use('/webhook', webhookRouter);
app.use('/wishlist', wishlistRouter);