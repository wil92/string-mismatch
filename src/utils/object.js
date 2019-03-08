/**
 * Return the arg if is not null, otherwise return the val value
 * @param arg argument to check if is null
 * @param val default value
 */
module.exports.defaultFor = function defaultFor(arg, val) {
    return typeof arg !== "undefined" ? arg : val;
};

/**
 * Checks if `value` is `null` or `undefined`.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 */
module.exports.isNil = function isNil(value) {
    return value == null;
};
