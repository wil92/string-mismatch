var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config');

var projectPath = path.resolve(__dirname, '..');

function copyFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.copyFile(
            path.resolve(projectPath, filePath),
            path.resolve(webpackConfig.output.path, filePath),
            function (err) {
            return err ? reject(err) : resolve();
        });
    });
}

new Promise(function (resolve, reject) {
    webpack(webpackConfig, function (err, stats) {
        return err ? reject(err) : resolve(stats);
    });
}).then(function () {
    return copyFile('package.json')
}).then(function () {
    return copyFile('README.md')
}).then(function () {
    return copyFile('LICENSE.md');
}).catch(function (err) {
    console.log('error', err);
});
