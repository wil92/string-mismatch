var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var webpackConfigProd = require('../webpack.config');
var webpackConfigDev = require('../webpack.dev.config');

var projectPath = path.resolve(__dirname, '..');

removeFiles(webpackConfigProd.output.path).then(function () {
    return new Promise(function (resolve, reject) {
        webpack(webpackConfigProd, function (err, stats) {
            return err ? reject(err) : resolve(stats);
        });
    })
}).then(function () {
    return new Promise(function (resolve, reject) {
        webpack(webpackConfigDev, function (err, stats) {
            return err ? reject(err) : resolve(stats);
        });
    })
}).then(function () {
    console.info('Build: DONE');
}).catch(function (err) {
    console.log('ERROR', err);
});

function copyFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.copyFile(
            path.resolve(projectPath, filePath),
            path.resolve(webpackConfigProd.output.path, filePath),
            function (err) {
                return err ? reject(err) : resolve();
            });
    });
}

function removeFiles(dirPath, deleteDir) {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(dirPath)) {
            return fs.readdir(dirPath, function (err, files) {
                return err ? reject(err) : resolve(files);
            })
        }
        resolve([]);
    }).then(function (files) {
        return files.reduce(function (prom, value) {
            return prom.then(function () {
                var thePath = path.resolve(dirPath, value);
                var stats = fs.statSync(thePath);
                return stats.isDirectory() ? removeFiles(thePath, true) : removeFile(thePath);
            });
        }, Promise.resolve());
    }).then(function () {
        if (deleteDir) {
            removeDir(dirPath);
        }
    })
}

function removeDir (dirPath) {
    return new Promise(function (resolve, reject) {
        fs.rmdir(dirPath, function (err) {
            return err ? reject(err) : resolve();
        })
    });
}

function removeFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.unlink(filePath, function(err) {
            return err ? reject(err) : resolve();
        })
    });
}
