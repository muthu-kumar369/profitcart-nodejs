const path = require("path");
const nodeExternal= require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: "./app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },{
                test:/\.html$/i,
                loader:"html-loader"
            }
        ]
    },
    target: "node",
    externals:[ nodeExternal()],
    resolve:{
        extensions:[".js"]
    },
    optimization:{
        minimize:true
    }
}