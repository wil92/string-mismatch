var merge = require("lodash/merge");
var toLower = require("lodash/toLower");

module.exports = function (options) {
    module.exports.options = merge({precision: 5}, options);
    return module.exports;
};

module.exports.differences = function (start, end) {
    return module.exports.diff(start, end);
};

/**
 * return the list of changes in the original text
 * @param start {string} start text
 * @param end {string} end text
 * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
 *      mtc: start part of the section
 *      del: erase part of the section
 *      ins: new part of the section
 *      sbs: last part of the section
 */
module.exports.diff = function (start, end) {
    var precision = defaultFor(module.exports.options.precision, 5);
    var ignoreCase = defaultFor(ignoreCase, false);
    var changeData = module.exports.getChanges(start, end, "", precision, ignoreCase),
        nextS = end.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length),
        nextThis = start.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length),
        result = [];
    result.push({
        mtc: changeData.mtc,
        del: changeData.del,
        ins: changeData.ins,
        sbs: changeData.sbs
    });

    if (nextThis !== "" || nextS !== "") {
        result = result.concat(module.exports.diff(nextThis, nextS));
    }
    return result;
};

/**
 * recursively find the posibles solutions for the differences between start and end texts
 * @param start {string} start text
 * @param end {string} end text
 * @param m {string} parameter no needed (is only for inside use)
 * @param precision {number} presition or
 * @param ignoreCase {boolean} ignore upper or lower characters
 * @returns {{fis: number, fil: number, sbs: string, mtc: string}}
 */
module.exports.getChanges = function (start, end, m, precision, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var isThisLonger = start.length >= end.length,
        bi = 0,
        longer = isThisLonger ? start : end,
        shorter = isThisLonger ? end : start;

    while (module.exports.ignoreCase(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi;
    longer = longer.slice(bi);
    shorter = shorter.slice(bi);

    var len = longer.length,
        cd = {
            fis: shorter.length,
            fil: len,
            sbs: "",
            mtc: m + end.slice(0, bi)
        },
        sub = {sbs: ""};

    if (shorter !== "") {
        for (var rc = 0; rc < len && sub.sbs.length < precision; rc++) {
            sub = module.exports.getMatchingSubstring(shorter, longer, rc, cd.mtc, ignoreCase);
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
        return module.exports.getChanges(cd.del, cd.ins, cd.mtc, precision, ignoreCase);
    }
};

/**
 * returns the first matching substring in-between the two strings
 * @param source {string} begin text
 * @param changed {string} end text
 * @param rot
 * @param m {string}
 * @param ignoreCase {boolean} ignore upper or lower characters
 * @returns {{fis: number, mtc: string, sbs: string}}
 */
module.exports.getMatchingSubstring = function (source, changed, rot, m, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var i = 0,
        slen = source.length,
        match = false,
        o = {fis: slen, mtc: m, sbs: ""};
    while (i < slen) {
        var len = changed.length;
        var indexRot = (i + (rot < 0 ? len - Math.abs(rot) % len : rot)) % len;
        if (module.exports.ignoreCase(changed[indexRot], source[i], ignoreCase)) {
            if (match) {
                o.sbs += source[i];
            } else {
                match = true;
                o.fis = i;
                o.sbs = source[i];
            }
        } else if (match) {
            break;
        }
        ++i;
    }
    return o;
};

/**
 * Compare two text ignoring the lower or upper characters
 * @param text1 {string} first text to compare
 * @param text2 {string} second text to compare
 * @param ignoreCase {boolean} ignore upper or lower characters
 * @return {boolean}
 */
module.exports.ignoreCase = function (text1, text2, ignoreCase) {
    if(!ignoreCase){
        return text1 === text2;
    }
    return toLower(text1) === toLower(text2);
};

function defaultFor(arg, val){
    return typeof arg !== "undefined" ? arg : val;
}
