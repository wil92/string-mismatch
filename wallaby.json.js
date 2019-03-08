module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            { pattern: 'src/**/*.test.js', ignore: true }
        ],
        tests: [
            'src/**/*.test.js'
        ],
        testFramework: 'mocha',
        env: {
            type: 'node'
        }
    };
};
