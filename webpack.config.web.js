var path = require('path');
var libraryName = 'string-mismatch';
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var config = {
    entry: path.join(__dirname, '/src/string-mismatch.js'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        globalObject: "this",
        filename: libraryName + '.min.js',
        library: 'sm',
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin()
    ]
};

module.exports = config;
