'user strict';

var _ = require('lodash');

module.exports.diff = function (text, precision) {

};

module.exports.rotate = function (text, n) {
    var len = text.length;
    if (n % len === 0) {
        return text.slice();
    }
    var res = new Array(text.length);
    for (var i = 0; i < len; i++) {
        res[i] = this[(i + (len + n % len)) % len];
    }
    return res;
};
