/**
 * Erase the in-between, start and end spaces
 * @param text {string}
 * @return {string}
 */
module.exports.eraseSpaces = function (text) {
    return text.replace(/\s\s+/g, " ").trim();
};

/**
 * Compare two text ignoring the lower or upper characters
 * @param text1 {string} first text to compare
 * @param text2 {string} second text to compare
 * @param ignoreCase {boolean} ignore upper or lower characters
 * @return {boolean} the compare result
 */
module.exports.compareChar = function (text1, text2, ignoreCase) {
    if (ignoreCase) {
        return text1.toLowerCase() === text2.toLowerCase();
    }
    return text1 === text2;
};
