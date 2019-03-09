var defaultFor = require("../utils/object").defaultFor;
var eraseSpaces = require("../utils/string").eraseSpaces;
var compareChar = require("../utils/string").compareChar;
var vars = require("../utils/vars");

/**
 * Greedy algorithm constructor
 * @param options {{precision: number, ignoreCase: boolean, ignoreSpaces: boolean}}
 */
module.exports = function (options) {
    module.exports.options = Object.assign({precision: 5, ignoreCase: true, ignoreSpaces: false}, defaultFor(options, {}));
    return module.exports;
};

/**
 * Calculate differences between start string and end string and return the transformations list
 * @param start {string} start string
 * @param end {string} end string
 * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformations
 */
module.exports.differences = function (start, end) {
    if (defaultFor(module.exports.options["ignoreSpaces"], false)) {
        start = eraseSpaces(start);
        end = eraseSpaces(end);
    }
    return module.exports.diff(start, end);
};

/**
 * Return the list of changes in the original text
 * @param start {string} start text
 * @param end {string} end text
 * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
 *      mtc: start part of the section
 *      del: erase part of the section
 *      ins: new part of the section
 *      sbs: last part of the section
 */
module.exports.diff = function (start, end) {
    var changeData = module.exports.getChanges(start, end, ""),
        nextS = end.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length),
        nextThis = start.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length),
        result = [];
    changeData.mtc && result.push({type: vars.EQL_NAME, value: changeData.mtc});
    changeData.del && result.push({type: vars.DEL_NAME, value: changeData.del});
    changeData.ins && result.push({type: vars.INS_NAME, value: changeData.ins});
    changeData.sbs && result.push({type: vars.EQL_NAME, value: changeData.sbs});

    if (nextThis !== "" || nextS !== "") {
        result = result.concat(module.exports.diff(nextThis, nextS));
    }
    return result;
};

/**
 * Recursively find the possibles solutions for the differences between start and end texts
 * @param start {string} start text
 * @param end {string} end text
 * @param unchangedStr {string} parameter no needed (is only for inside use)
 * @returns {{fis: number, fil: number, sbs: string, mtc: string}}
 */
module.exports.getChanges = function (start, end, unchangedStr) {
    var ignoreCase = defaultFor(module.exports.options.ignoreCase, false),
        precision = defaultFor(module.exports.options.precision, 5),
        isThisLonger = start.length >= end.length,
        bi = 0,
        longer = isThisLonger ? start : end,
        shorter = isThisLonger ? end : start;

    while (compareChar(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi;
    longer = longer.slice(bi);
    shorter = shorter.slice(bi);

    var len = longer.length,
        cd = {
            fis: shorter.length,
            fil: len,
            sbs: "",
            mtc: unchangedStr + end.slice(0, bi)
        },
        sub = {sbs: ""};

    if (shorter !== "") {
        for (var rc = 0; rc < len && sub.sbs.length < precision; rc++) {
            sub = module.exports.getMatchingSubstring(shorter, longer, rc, cd.mtc);
            sub.fil = rc < len - sub.fis ? sub.fis + rc
                : sub.fis - len + rc;
            sub.sbs.length > cd.sbs.length && (cd = sub);
        }
    }
    cd.del = isThisLonger ? longer.slice(0, cd.fil) : shorter.slice(0, cd.fis);
    cd.ins = isThisLonger ? shorter.slice(0, cd.fis) : longer.slice(0, cd.fil);

    if (cd.del.indexOf(" ") === -1 || cd.ins.indexOf(" ") === -1 || cd.del === "" || cd.ins === "" || cd.sbs === "") {
        return cd;
    } else {
        return module.exports.getChanges(cd.del, cd.ins, cd.mtc);
    }
};

/**
 * Returns the first matching substring in-between the two strings
 * @param source {string} begin text
 * @param changed {string} end text
 * @param rotation {number} rotation value in the changed string
 * @param unchangedStr {string} Not changed sub-string value
 * @returns {{fis: number, mtc: string, sbs: string}}
 */
module.exports.getMatchingSubstring = function (source, changed, rotation, unchangedStr) {
    var ignoreCase = defaultFor(module.exports.options.ignoreCase, false),
        index = 0,
        sourceLength = source.length,
        changedLength = changed.length,
        match = false,
        subResult = {fis: sourceLength, mtc: unchangedStr, sbs: ""};
    while (index < sourceLength) {
        var indexRot = (index + (rotation < 0 ? changedLength - Math.abs(rotation) % changedLength : rotation)) % changedLength;
        if (compareChar(changed[indexRot], source[index], ignoreCase)) {
            if (match) {
                subResult.sbs += source[index];
            } else {
                match = true;
                subResult.fis = index;
                subResult.sbs = source[index];
            }
        } else if (match) {
            break;
        }
        ++index;
    }
    return subResult;
};
