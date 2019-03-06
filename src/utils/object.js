module.exports.defaultFor = function defaultFor(arg, val) {
    return typeof arg !== "undefined" ? arg : val;
};
