var vars = require("../utils/vars");
var defaultFor = require("../utils/object").defaultFor;
var eraseSpaces = require("../utils/string").eraseSpaces;

var MAX_VALUE = 9999999999;
var SUB = 0,
    DEL = 1,
    INS = 2;

module.exports = function (options) {
    module.exports.options = Object.assign({ignoreCase: true, ignoreSpaces: false}, defaultFor(options, {}));
    return module.exports;
};

module.exports.differences = function (start, end) {
    if (defaultFor(module.exports.options['ignoreSpaces'], false)) {
        start = eraseSpaces(start);
        end = eraseSpaces(end);
    }
    module.exports.calculateMatrix(start, end);
    var result = [];
    var subResult = module.exports.reconstructSolution(start, end);
    if (subResult.length > 0) {
        var sub = {type: subResult[0].type, value: subResult[0].value};
        for (var i = 1; i < subResult.length; i++) {
            if (subResult[i].type !== sub.type || sub.type === vars.SUB_NAME) {
                result.push(sub);
                sub = {type: subResult[i].type, value: ''};
            }
            sub.value += subResult[i].value;
        }
        result.push(sub);
    }
    return result;
};

module.exports.reconstructSolution = function (start, end) {
    var result = [];
    var si = 0, sl = start.length,
        ei = 0, el = end.length;
    while (si !== sl - 1 || ei !== el - 1) {
        var options = [];
        si + 1 < sl && options.push([si + 1, ei, DEL]);
        ei + 1 < el && options.push([si, ei + 1, INS]);
        si + 1 < sl && ei + 1 < el && options.push([si + 1, ei + 1, SUB]);
        var best = options.sort(function (o, p) {
            if (module.exports.dp[o[0]][o[1]] === module.exports.dp[p[0]][p[1]]) {
                return o[2] - p[2];
            }
            return module.exports.dp[o[0]][o[1]] - module.exports.dp[p[0]][p[1]];
        })[0];
        if (best[2] === SUB) {
            if (module.exports.dp[si][ei] === module.exports.dp[best[0]][best[1]]){
                result.push({type: vars.EQL_NAME, value: start[si]});
            } else {
                result.push({type: vars.SUB_NAME, value: start[si] + end[ei]});
            }
        } else if (best[2] === DEL) {
            result.push({type: vars.DEL_NAME, value: start[si]});
        } else {
            result.push({type: vars.INS_NAME, value: end[ei]});
        }
        si = best[0];
        ei = best[1];
    }
    result.push({
        type: module.exports.dp[si][ei] === 1 ? vars.SUB_NAME : vars.EQL_NAME,
        value: module.exports.dp[si][ei] === 1 ? start[si] + end[ei] : start[si]
    });
    return result;
};

module.exports.calculateMatrix = function (start, end) {
    // Fill the dp with the initial values
    module.exports.dp = [];
    for (var i = 0; i < start.length; i++) {
        var array = [];
        for (var j = 0; j < end.length; j++) {
            array.push(-1);
        }
        module.exports.dp.push(array);
    }
    calculateLevenshtein(start, 0, end, 0);
    return module.exports.dp;
};

function calculateLevenshtein(start, si, end, ei) {
    if (si === start.length && ei === end.length) {
        return 0;
    }
    if (si === start.length || ei === end.length) {
        return MAX_VALUE;
    }
    if (module.exports.dp[si][ei] !== -1) {
        return module.exports.dp[si][ei];
    }
    return module.exports.dp[si][ei] = Math.min(
        calculateLevenshtein(start, si + 1, end, ei) + 1,
        calculateLevenshtein(start, si, end, ei + 1) + 1,
        calculateLevenshtein(start, si + 1, end, ei + 1) + (start[si] === end[ei] ? 0 : 1)
    );
}
