// noinspection JSUnresolvedFunction
var sm = require('../lib/string-mismatch');

function showResult(diffs) {
    return diffs.reduce(function (text, value) {
        return text + value.mtc + (value.del ? '(-' + value.del +')' : '') + (value.ins ? '(+' + value.ins + ')' : '') + value.sbs;
    }, '');
}

console.log('----------------------------------------------------------');
var start = 'This is a test for see how work the library',
    end = 'This is a test for know how work the new library';
console.log('start text,', start);
console.log('sm.diff(start, end, 5)');
var m = sm.diff(start, end, 5);
console.log(m);
console.log('----------------------------------------------------------');
console.log(showResult(m));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
var good = 'aGuillermo Gonzalez Jimenez',
    bad = 'Guillelmo   Gonzales   Jimenes';
console.log('good,', good);
console.log('bad,', bad);
console.log('sm.evaluateCharacterPercent(good, bad, 0.6, 5)');
m = sm.evaluateCharacterPercent(good, bad, 0.6, 5);
console.log(m);
console.log('----------------------------------------------------------');
console.log(showResult(m.diffs));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');


