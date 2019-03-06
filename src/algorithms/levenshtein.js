module.exports = function (options) {
    module.exports.options = options;
};

module.exports.differences = function (start, end) {
    module.exports.calculateMatrix(start, end);
    var result = [];
    var sub = {mtc: '', del: '', ins: '', sbs: ''};
    var subResult = module.exports.fun(start, start.length, end, end.length);
    for (var i = 0, j = 0; i < subResult.length; i++) {
        if (subResult[i].eq !== '' && j === 0) {
            sub.mtc += subResult[i].eq;
            subResult[i].eq = '';
            j = 1;
        }
        if (subResult[i].del !== '') {
            if (j > 2) {
                result.push(sub);
                sub = {mtc: '', del: '', ins: '', sbs: ''};
            }
            sub.del += subResult[i].del;
            j = 2;
        }
        if (subResult[i].ins !== '') {
            if (j>2) {
                result.push(sub);
                sub = {mtc: '', del: '', ins: '', sbs: ''};
            }
            sub.ins += subResult[i].ins;
            j = 2;
        }
        if (subResult[i].eq !== '') {
            sub.sbs += subResult[i].eq;
            j = 3;
        }
    }
    result.push(sub);
    return result;
};

module.exports.fun = function (start, si, end, ei) {
    if (si === 0 && ei === 0) {
        return [];
    }
    var options = [];
    ei - 1 >= 0 && options.push([si, ei - 1, 0]);
    si - 1 >= 0 && ei - 1 >= 0 && options.push([si - 1, ei - 1, 1]);
    si - 1 >= 0 && options.push([si - 1, ei, 2]);
    var mi = options.sort(function (o, p) {
        if (module.exports.dp[o[0]][o[1]] === module.exports.dp[p[0]][p[1]]) {
            return o[2] - p[2];
        }
        return module.exports.dp[o[0]][o[1]] - module.exports.dp[p[0]][p[1]];
    })[0];
    var result = module.exports.fun(start, mi[0], end, mi[1]);
    if (mi[0] !== si && mi[1] !== ei) {
        result.push({eq: start[mi[0]], del: '', ins: ''});
    } else if (mi[0] !== si) {
        result.push({eq: '', del: start[mi[0]], ins: ''});
    } else {
        result.push({eq: '', del: '', ins: end[mi[1]]});
    }
    return result;
};

module.exports.calculateMatrix = function (start, end) {
    module.exports.dp = [];
    for (var i = 0; i < start.length + 1; i++) {
        var array = [];
        for (var j = 0; j < end.length + 1; j++) {
            array.push(-1);
        }
        module.exports.dp.push(array);
    }
    // console.log('calculateMatrix', module.exports.dp);
    calculate(start, 0, end, 0);
    return module.exports.dp;
};

function calculate(start, si, end, ei) {
    if (si > start.length || ei > end.length) {
        return 99999999;
    }
    if (si === start.length && end.length === ei) {
        return 0;
    }
    if (module.exports.dp[si][ei] !== -1) {
        return module.exports.dp[si][ei];
    }
    return module.exports.dp[si][ei] = Math.min(
        calculate(start, si + 1, end, ei) + 1,
        calculate(start, si, end, ei + 1) + 1,
        calculate(start, si + 1, end, ei + 1) + (start[si] === end[ei] ? 0 : 1)
    );
}
