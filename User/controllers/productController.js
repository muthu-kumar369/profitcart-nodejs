const { Response } = require("../../services/ResponseService");
const config = require("../../config.js");
const Products = require("../models/productModel.js");

const productList = async (req, res) => {
    try {
        const { search, page, size } = req.query;
        const query = search ? [
            { title: { $regex: new RegExp(search, 'i') } },
            { description: { $regex: new RegExp(search, 'i') } },
            { brand: { $regex: new RegExp(search, 'i') } },
            { actual_price: { $regex: new RegExp(search, 'i') } },
            { sub_category: { $regex: new RegExp(search, 'i') } },
            { seller: { $regex: new RegExp(search, 'i') } },
        ] : [];
        const skip = (page - 1) * size;
        // skip<=0 || skip==null || typeof(skip)==undefined ? 0:skip;
        // size<=0 || size==null || typeof(size)==undefined ? 0:size;
        data = {
            page,
            size
        }
        console.log(skip, size);
        if (query.length != 0) {

            data.totalLength = await Products.find({ $or: query }).count();
            let totalPage = parseInt(data.totalLength / 10);
            let decimal = data.totalLength % 10;
            if (decimal > 0) {
                totalPage++;
            }
            data.totalPage = totalPage
            if (skip == 0 && size == 0) {
                console.log("I am in");
                await Products.find({ $or: query }).then((products) => {
                    data.product = products
                    Response(res, 200, config.success_message, null, data)
                })
            } else {
                await Products.find({ $or: query }).skip(skip).limit(size).then((products) => {
                    data.product = products
                    Response(res, 200, config.success_message, null, data)
                })
            }
        } else {
            data.totalLength = await Products.find().count();
            data.totalPage = data.totalLength / 10;
            await Products.find().skip(skip).limit(size).then((products) => {
                data.product = products
                Response(res, 200, config.success_message, null, data)
            })
        }
    } catch (error) {
        console.log(error);
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const productDetails = async (req, res) => {
    try {
        const proudctId = req.params.id;
       await Products.findById({ _id: proudctId }).then((product) => {
            let description=product.description.split(".");
            Response(res, 200, config.success_message, "Product fetched successfull", {data:product,description})
        })
    } catch (error) {
        Response(res, 400, config.error_message, error?.message ?? error, null)
    }
}

const proudctForIndex = async (req, res) => {
    try {
        const data = [];

        const products = await Products.find().skip(0).limit(500);       

        const promise = products.map((item, index) => {
            let price = item.discount.split(" ");
            price = price[0].split("%");
            if (Number(price[0]) > 70 && item.images[0]) {
                data.push(item)
            }
        });
        await Promise.all(promise).then(() => {
            // data[0].length=data[0]?.items.length;
            // data[1].length=data[1]?.items.length;
            // data[2].length=data[2]?.items.length;
            // data[3].length=data[3]?.items.length;
            Response(res, 200, config.success_message, null, {
                length: data.length,
                product: data
            })
        })
    } catch (error) {
        console.log(error);
        Response(res,400,config.error_message,error?.message ?? error,null)
    }

}
module.exports = {
    productList,
    productDetails,
    proudctForIndex
}