var path = require("path");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var config = {
    entry: {
        "string-mismatch.min": path.join(__dirname, "/src/string-mismatch.js")
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "lib"),
        globalObject: "this",
        filename: "[name].js",
        library: "sm",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                include: /\.min\.js$/
            })
        ]
    }
};

var configLevenshtein = {
    entry: {
        "levenshtein.min": path.join(__dirname, "/src/algorithms/levenshtein.js")
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "lib"),
        globalObject: "this",
        filename: "[name].js",
        library: "levenshtein",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                include: /\.min\.js$/
            })
        ]
    }
};

module.exports = [config, configLevenshtein];
