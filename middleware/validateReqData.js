const { Response } = require("../services/ResponseService");
const validationSchema = require("../services/validationSchema");
const config = require("../config")

const validateReqData = (schema) => {
    return (req, res, next) => {
        console.log("I am inside validate schema")
        if (schema && validationSchema[`${schema}`]) {
            const { error, value } = validationSchema[`${schema}`].validate(req?.body);
            console.log(error, value)
            if (error) {
                Response(res, 400, config.error_message, error?.details[0]?.message);
            } else {
                req.body = value;
                next()
            }
        } else {
            console.log("I don't have nothing");
            next()
        }
    }
}

module.exports = validateReqData;