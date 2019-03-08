var isNil = require("./utils/object").isNil;

module.exports.use = function (algorithm) {
    module.exports.algorithm = algorithm || require("./algorithms/greedy")();
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
    checkAlgorithm();
    return module.exports.algorithm.differences(start, end);
};

function checkAlgorithm() {
    isNil(module.exports.algorithm) && module.exports.use();
}
