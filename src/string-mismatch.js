/** @ignore */
var isNil = require("./utils/object").isNil;

/**
 * Change the algorithm for calculate string differences or use greedy algorithm by default
 * @access public
 * @param algorithm Algorithm instance to use
 */
module.exports.use = function (algorithm) {
    module.exports.algorithm = algorithm || require("./algorithms/greedy")();
};

/**
 * return the list of changes in the original text
 * @access public
 * @param start {string} start text
 * @param end {string} end text
 * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
 *      mtc: start part of the section
 *      del: erase part of the section
 *      ins: new part of the section
 *      sbs: last part of the section
 */
module.exports.diff = function (start, end) {
    checkAlgorithm();
    return module.exports.algorithm.differences(start, end);
};

/**
 * Check if there is some algorithm instance in the library and use greedy algorithm by default otherwise
 * @access private
 */
function checkAlgorithm() {
    isNil(module.exports.algorithm) && module.exports.use();
}
