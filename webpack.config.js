var path = require("path");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var env = process.env['SM_ENV'] || 'production';

var config = {
    name: "string-mismatch",
    entry: {
        "string-mismatch.min": path.join(__dirname, "/src/string-mismatch.js")
    },
    stats: true,
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
    },
    plugins: env === 'development' ? [new BundleAnalyzerPlugin({
        analyzerPort: 0
    })] : []
};

var configLevenshtein = {
    name: "levenshtein",
    entry: {
        "levenshtein.min": path.join(__dirname, "/src/algorithms/levenshtein.js")
    },
    stats: true,
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
    },
    plugins: env === 'development' ? [new BundleAnalyzerPlugin({
        analyzerPort: 0
    })] : []
};

module.exports = [config, configLevenshtein];
