module.exports = function (wallaby) {
    return {
        files: [
            "src/**/*.js",
            { pattern: "src/**/*.test.js", ignore: true }
        ],
        tests: [
            "src/**/*.test.js"
        ],
        compilers: {
            "src/**/*.js": wallaby.compilers.babel()
        },
        testFramework: "mocha",
        env: {
            type: "node"
        }
    };
};
