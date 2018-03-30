// noinspection JSUnresolvedFunction
var sm = require('../string-mismatch');

// console.log("arguments", process.argv);

console.log('----------------------------------------------------------');
var start = 'This is a test for see how work the library',
    end = 'This is a test for know how work the new library';
console.log('start text,', start);
console.log('sm.diff(start, end, 5)');
console.log(sm.diff(start, end, 5));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
var good = 'Guillermo Gonzalez Jimenez',
    bad = 'Guillelmo   Gonzales   Jimenes';
console.log('good,', good);
console.log('bad,', bad);
console.log('sm.evaluateCharacterPercent(good, bad, 0.6, 5)');
console.log(sm.evaluateCharacterPercent(good, bad, 0.6, 5));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');


