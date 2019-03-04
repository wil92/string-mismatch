"use strict";

var replace = require("lodash/replace");
var trim = require("lodash/trim");
var toLower = require("lodash/toLower");

/**
 * With this function you can evaluate if two string are equals, with a percent of different characters.
 * @param start {string} start text
 * @param end {string} end text
 * @param percent {number} percent of correct characters of the original text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @param ignoreCase {boolean} ignore upper or lower characters (by default is false)
 * @return {{percent: number, good: boolean, diffs: ({mtc, del, ins, sbs}[])}}
 */
exports.diffPercent = function (start, end, percent, precision, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var diffs,
        wc = 0;

    start = this.eraseSpaces(start);
    end = this.eraseSpaces(end);

    diffs = this.diff(start, end, precision, ignoreCase);

    for (var i = 0; i < diffs.length; i++) {
        var diff = diffs[i];
        wc += Math.max(diff.del.length, diff.ins.length);
    }

    // calculate the percent of mistakes
    wc = Math.min(start.length, wc);
    return {
        percent: wc / start.length,
        good: percent < 1 - wc / start.length,
        diffs: diffs
    };
};

/**
 * With this function you can evaluate if two string are equals, with a percent of different characters.
 * @deprecated Will be deleted in version 2.0. Use diffPercent instead
 * @param start {string} start text
 * @param end {string} end text
 * @param percent {number} percent of correct characters of the original text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @param ignoreCase {boolean} ignore upper or lower characters (by default is false)
 * @return {{percent: number, good: boolean, diffs: ({mtc, del, ins, sbs}[])}}
 */
exports.evaluateCharacterPercent = exports.diffPercent;

/**
 * Erase the in-between, start and end spaces
 * @param text {string}
 * @return {string}
 */
exports.eraseSpaces = function (text) {
    var newText = replace(text, /\s\s+/g, " ");
    return trim(newText);
};

/**
 * return the list of changes in the original text
 * @param start {string} start text
 * @param end {string} end text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @param ignoreCase {boolean} ignore upper or lower characters (by default is false)
 * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
 *      mtc: start part of the section
 *      del: erase part of the section
 *      ins: new part of the section
 *      sbs: last part of the section
 */
exports.diff = function (start, end, precision, ignoreCase) {
    precision = defaultFor(precision, 5);
    ignoreCase = defaultFor(ignoreCase, false);
    var changeData = this.getChanges(start, end, "", precision, ignoreCase),
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
        result = result.concat(this.diff(nextThis, nextS, precision, ignoreCase));
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
exports.getChanges = function (start, end, m, precision, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var isThisLonger = start.length >= end.length,
        bi = 0,
        longer = isThisLonger ? start : end,
        shorter = isThisLonger ? end : start;

    while (this.ignoreCase(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi;
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
            sub = this.getMatchingSubstring(shorter, this.rotate(longer, rc), cd.mtc, ignoreCase);
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
        return this.getChanges(cd.del, cd.ins, cd.mtc, precision, ignoreCase);
    }
};

/**
 * returns the first matching substring in-between the two strings
 * @param source {string} begin text
 * @param changed {string} end text
 * @param m {string}
 * @param ignoreCase {boolean} ignore upper or lower characters
 * @returns {{fis: number, mtc: string, sbs: string}}
 */
exports.getMatchingSubstring = function (source, changed, m, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var i = 0,
        slen = source.length,
        match = false,
        o = {fis: slen, mtc: m, sbs: ""};
    while (i < slen) {
        if (this.ignoreCase(changed[i], source[i], ignoreCase)) {
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
exports.ignoreCase = function (text1, text2, ignoreCase) {
    if(!ignoreCase){
        return text1 === text2;
    }
    return toLower(text1) === toLower(text2);
};

/**
 * rotate a string (n) times to the left, if it's a negative value then rotate (-n) times to the right
 * @param text {string} string to rotate
 * @param n {number} time to rotate
 * @returns {string} new rotate string
 */
exports.rotate = function (text, n) {
    n = n | 0;
    var len = text.length;
    n = n < 0 ? len - Math.abs(n) % len : n;
    if (n % len === 0) {
        return text;
    }
    var res = "";
    for (var i = 0; i < len; i++) {
        res += text[(i + (len + n % len)) % len];
    }
    return res;
};

function defaultFor(arg, val){
    return typeof arg !== "undefined" ? arg : val;
}
