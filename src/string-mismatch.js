var replace = require("lodash/replace");
var trim = require("lodash/trim");
var isNil = require("lodash/isNil");

module.exports.use = function (algorithm) {
    module.exports.algorithm = algorithm || require('./algorithms/greedy')();
};

/**
 * With this function you can evaluate if two string are equals, with a percent of different characters.
 * @param start {string} start text
 * @param end {string} end text
 * @param percent {number} percent of correct characters of the original text
 * @return {{percent: number, good: boolean, diffs: ({mtc, del, ins, sbs}[])}}
 */
module.exports.diffPercent = function (start, end, percent) {
    isNil(module.exports.algorithm) && module.exports.use();
    var wc = 0;

    start = this.eraseSpaces(start);
    end = this.eraseSpaces(end);

    var diffs = module.exports.algorithm.differences(start, end);

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
 * @deprecated Will be devared in version 2.0. Use diffPercent instead
 * @param start {string} start text
 * @param end {string} end text
 * @param percent {number} percent of correct characters of the original text
 * @param precision {number} number of characters to expand the search for the text (by default is 5)
 * @param ignoreCase {boolean} ignore upper or lower characters (by default is false)
 * @return {{percent: number, good: boolean, diffs: ({mtc, del, ins, sbs}[])}}
 */
module.exports.evaluateCharacterPercent = exports.diffPercent;

/**
 * Erase the in-between, start and end spaces
 * @param text {string}
 * @return {string}
 */
exports.eraseSpaces = function (text) {
    return trim(replace(text, /\s\s+/g, " "));
};
