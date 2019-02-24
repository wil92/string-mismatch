var webpack = require('webpack');
var webpackConfig = require('../webpack.config');

new Promise(function (resolve, reject) {
    webpack(webpackConfig, function (err, stats) {
        return err ? reject(err) : resolve(stats);
    });
})
    .then(function (ignore) {
        console.log('good', ignore);
    })
    .catch(function (err) {
        console.log('error', err);
    });
