'user strict';

var _ = require('lodash');

module.exports.diff = function (text, precision) {

};

module.exports.rotate = function (text, n) {
    n = n | 0;
    var len = text.length;
    n = n < 0 ? len - Math.abs(n) % len : n;
    if (n % len === 0) {
        return text.slice();
    }
    var res = '';
    for (var i = 0; i < len; i++) {
        res += text[(i + (len + n % len)) % len];
    }
    return res;
};
