var path = require("path");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

var env = process.env["SM_ENV"] || "production";

var baseCofing = {
    stats: true,
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                include: /\.min\.js$/
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    devtool: "source-map"
};

var config = Object.assign({}, baseCofing, {
    name: "string-mismatch",
    entry: {
        "string-mismatch.min": path.join(__dirname, "/src/string-mismatch.js")
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        globalObject: "this",
        filename: "[name].js",
        library: "sm",
        libraryTarget: "umd",
        libraryExport: "default",
        umdNamedDefine: true
    },
    plugins: env === "development" ? [new BundleAnalyzerPlugin({
        analyzerPort: 0
    })] : []
});

var configLevenshtein = Object.assign({}, baseCofing, {
    name: "levenshtein",
    entry: {
        "levenshtein.min": path.join(__dirname, "/src/algorithms/levenshtein.js")
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        globalObject: "this",
        filename: "[name].js",
        library: "levenshtein",
        libraryTarget: "umd",
        libraryExport: "default",
        umdNamedDefine: true
    },
    plugins: env === "development" ? [new BundleAnalyzerPlugin({
        analyzerPort: 0
    })] : []
});

var configs = [config, configLevenshtein];
var notMinify = configs.map(function (config) {
    var entry = {}, key = Object.keys(config.entry)[0];
    entry[key.replace(".min", "")] = config.entry[key];
    return Object.assign({}, config, {
        entry: entry,
        optimization: {minimize: false},
        plugins: []
    });
});
configs = notMinify.concat(configs);

module.exports = configs;
