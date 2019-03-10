var path = require("path");

var UglifyJSPlugin = require("uglifyjs-webpack-plugin");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

var env = process.env["SM_ENV"] || "production";

var baseConfig = {
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
    devtool: "source-map",
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
};

var configsModules = [
    {
        name: "string-mismatch",
        entry: {"string-mismatch.min": path.join(__dirname, "/src/string-mismatch.js")},
        output: {library: "sm"}
    },
    {
        name: "levenshtein",
        entry: {"levenshtein.min": path.join(__dirname, "/src/algorithms/levenshtein.js")},
        output: {library: "levenshtein"}
    },
    {
        name: "greedy",
        entry: {"greedy.min": path.join(__dirname, "/src/algorithms/greedy.js")},
        output: {library: "greedy"}
    }
];


var configs = configsModules.map(function (config) {
    return Object.assign({}, baseConfig, {
        name: config.name,
        entry: config.entry,
        output: Object.assign({}, baseConfig.output, config.output)
    });
});

var notMinify = configs.map(function (config) {
    var entry = {}, key = Object.keys(config.entry)[0];
    entry[key.replace(".min", "")] = config.entry[key];
    return Object.assign({}, config, {
        entry: entry,
        optimization: {minimize: false},
        plugins: []
    });
});

module.exports = notMinify.concat(configs);
