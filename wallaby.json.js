var wallabify = require('wallabify');
var wallabyPostprocessor = wallabify({});

module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            { pattern: 'src/**/*.test.js', ignore: true }
            // {pattern: 'src/**/*.js', load: false}
        ],
        tests: [
            'src/**/*.test.js'
            // {pattern: 'src/**/*.test.js', load: false}
        ],
        testFramework: 'mocha',
        env: {
            type: 'node',
        }
    };
};
