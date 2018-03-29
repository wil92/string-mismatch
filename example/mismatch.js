var sm = require('../string-mismatch');

// console.log("arguments", process.argv);

var start = 'This is a test for see how work the library',
    end = 'This is a test for know how work the new library';

console.log('----------------------------------------------------------');
console.log(start);
console.log(sm.diff(start, end, 5));
console.log('----------------------------------------------------------');
