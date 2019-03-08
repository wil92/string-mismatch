/**
 * Return the arg if is not null, otherwise return the val value
 * @param arg argument to check if is null
 * @param val default value
 */
module.exports.defaultFor = function defaultFor(arg, val) {
    return typeof arg !== "undefined" ? arg : val;
};
