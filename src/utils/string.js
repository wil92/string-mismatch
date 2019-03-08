/**
 * Erase the in-between, start and end spaces
 * @param text {string}
 * @return {string}
 */
exports.eraseSpaces = function (text) {
    return text.replace(/\s\s+/g, " ").trim();
};
