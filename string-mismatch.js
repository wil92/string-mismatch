'use strict';

var _ = require('lodash');

/**
 * With this function you can evaluate if two string are equals, with a percent of differences characters.
 * @param start {string} start text
 * @param end {string} end text
 * @param percent {number} percent of correct characters of the original text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @return {{percent: number, good: boolean, diffs: ({mtc, del, ins, sbs}[])}}
 */
exports.evaluateCharacterPercent = function (start, end, percent, precision, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var diffs,
        wc = 0;

    start = this.eraseSpaces(start);
    end = this.eraseSpaces(end);

    diffs = this.diff(start, end, precision, ignoreCase);

    for (var i = 0, diff = diffs[i]; i < diffs.length; i++) {
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
 * Erase the in-between, start and end spaces
 * @param text {string}
 * @return {string}
 */
exports.eraseSpaces = function (text) {
    var newText = _.replace(text, /\s\s+/g, ' ');
    return _.trim(newText);
};

/**
 * return the list of changes in the original text
 * @param start {string} start text
 * @param end {string} end text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @param ignoreCase {boolean}
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
        nextS = end.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length),    // remaining part of "s"
        nextThis = start.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length), // remaining part of "this"
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
        bi = 0,  // base index designating the index of first mismacthing character in both strings
        longer = isThisLonger ? start : end,
        shorter = isThisLonger ? end : start;

    while (this.ignoreCase(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi; // make bi the index of first mismatching character
    longer = longer.slice(bi);   // as the longer string will be rotated it is converted into array
    shorter = shorter.slice(bi);           // shorter and longer now starts from the first mismatching character

    var len = longer.length,              // length of the longer string
        cd = {
            fis: shorter.length,       // the index of matching string in the shorter string
            fil: len,                  // the index of matching string in the longer string
            sbs: "",                   // the matching substring itself
            mtc: m + end.slice(0, bi)
        },   // if exists mtc holds the matching string at the front
        sub = {sbs: ""};                   // returned substring per 1 character rotation of the longer string

    if (shorter !== "") {
        for (var rc = 0; rc < len && sub.sbs.length < precision; rc++) {           // rc -> rotate count, precision -> precision factor
            sub = this.getMatchingSubstring(shorter, this.rotate(longer, rc), cd.mtc, ignoreCase); // rotate longer string 1 char and get substring
            sub.fil = rc < len - sub.fis ? sub.fis + rc                     // mismatch is longer than the mismatch in short
                : sub.fis - len + rc;              // mismatch is shorter than the mismatch in short
            sub.sbs.length > cd.sbs.length && (cd = sub);                   // only keep the one with the longest substring.
        }
    }
    // insert the mismatching delete subsrt and insert substr to the cd object and attach the previous substring
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
 * @param ignoreCase {boolean}
 * @returns {{fis: number, mtc: string, sbs: string}}
 */
exports.getMatchingSubstring = function (source, changed, m, ignoreCase) {
    ignoreCase = defaultFor(ignoreCase, false);
    var i = 0,
        slen = source.length,
        match = false,
        o = {fis: slen, mtc: m, sbs: ""};       // temporary object used to construct the cd (change data) object
    while (i < slen) {
        if (this.ignoreCase(changed[i], source[i], ignoreCase)) {
            if (match) {
                // o.sbs holds the matching substring itsef
                o.sbs += source[i];
            } else {
                match = true;
                o.fis = i;
                o.sbs = source[i];
            }
        } else if (match) {
            // stop after the first found substring
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
 * @param ignoreCase {boolean}
 * @return {boolean}
 */
exports.ignoreCase = function (text1, text2, ignoreCase) {
    if(!ignoreCase){
        return text1 === text2;
    }
    return _.toLower(text1) === _.toLower(text2);
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
    var res = '';
    for (var i = 0; i < len; i++) {
        res += text[(i + (len + n % len)) % len];
    }
    return res;
};

function defaultFor(arg, val){
    return typeof arg !== 'undefined' ? arg : val;
}
