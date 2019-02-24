var path = require('path');
var libraryName = 'string-mismatch';

var config = {
    entry: path.join(__dirname, '/src/string-mismatch.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: libraryName + '.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};

module.exports = config;
