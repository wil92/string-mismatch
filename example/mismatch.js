var sm = require('../lib/string-mismatch');

// console.log("arguments", process.argv);

var start = 'This is a test for see how work the library',
    end = 'This is a test know how work the library';

console.log('----------------------------------------------------------');
console.log(start);
console.log(sm.diff(start, end, 10));
console.log('----------------------------------------------------------');
