'use strict';

/**
 * With this function you can evaluate if two string are equals, with a percent of differences characters.
 * @param start start text
 * @param end end text
 * @param percent percent of correct characters of the original text
 * @param precision number of characters to expand the search for the text (by default is 5)
 * @return {[{good, diffs: [{mtc, del, ins, sbs}]}]}
 */
exports.evaluateCharacterPercent = function (start, end, percent, precision) {
    var diffs,
        wc = 0;

    start = this.eraseSpaces(start);
    end = this.eraseSpaces(end);


    diffs = this.diff(start, end, precision);

    for (var i = 0, diff = diffs[i]; i < diffs.length; i++) {
        wc += Math.max(diff.del.length, diff.ins.length);
    }

    // calculate the percent of mistakes
    wc = Math.min(start.length, wc);
    return {
        good: percent > wc / start.length,
        diffs: diffs};
};

/**
 * Erase the in-between, start and end spaces
 * @param text
 */
exports.eraseSpaces = function (text) {
    var newText = '',
        flag = false;
    // erase in-between spaces
    for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ' && !flag) {
            flag = true;
            newText += text[i];
        } else if (text[i] !== ' ') {
            flag = false;
            newText += text[i];
        }
    }
    if (newText[0] === ' ') {
        newText = newText.slice(1);
    }
    if (newText[newText.length - 1] === ' ') {
        newText = newText.slice(0, newText.length - 1);
    }
    return newText;
};

/**
 * return the list of changes in the original text
 * @param start start text
 * @param end end text
 * @param precision number of characters to expand the search for the text (by default is 5)
 * @return {[{mtc, del, ins, sbs}]}
 *      {mtc: start part of the section
 *      del: erase part of the section
 *      ins: new part of the section
 *      sbs: last part of the section}
 */
exports.diff = function (start, end, precision) {
    precision = precision | 5;
    var changeData = this.getChanges(start, end, "", precision),
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
        result = result.concat(this.diff(nextThis, nextS, precision));
    }
    return result;
};

/**
 * recursively find the posibles solutions for the differences between start and end texts
 * @param start start text
 * @param end end text
 * @param m parameter no needed (is only for inside use)
 * @param precision presition or
 * @returns {{fis, fil, sbs: string, mtc: *}}
 */
exports.getChanges = function (start, end, m, precision) {
    var isThisLonger = start.length >= end.length,
        bi = 0,  // base index designating the index of first mismacthing character in both strings
        longer = isThisLonger ? start : end,
        shorter = isThisLonger ? end : start;

    while (shorter[bi] === longer[bi] && bi < shorter.length) ++bi; // make bi the index of first mismatching character
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
            sub = this.getMatchingSubstring(shorter, this.rotate(longer, rc), cd.mtc); // rotate longer string 1 char and get substring
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
        return this.getChanges(cd.del, cd.ins, cd.mtc, precision);
    }
};

/**
 * returns the first matching substring in-between the two strings
 * @param source begin text
 * @param changed end text
 * @param m
 * @returns {{fis, mtc: *, sbs: string}}
 */
exports.getMatchingSubstring = function (source, changed, m) {
    var i = 0,
        slen = source.length,
        match = false,
        o = {fis: slen, mtc: m, sbs: ""};       // temporary object used to construct the cd (change data) object
    while (i < slen) {
        if (changed[i] === source[i]) {
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
 * rotate a string (n) times to the left, if it's a negative value then rotate (-n) times to the right
 * @param text string to rotate
 * @param n time to rotate
 * @returns {*} new rotate string
 */
exports.rotate = function (text, n) {
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
