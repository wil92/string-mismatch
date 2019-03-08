// noinspection JSUnresolvedFunction
var sm = require('../lib/string-mismatch.min');
var lev = require('../lib/levenshtein.min');

function showResult(diffs) {
    return diffs.reduce(function (text, value) {
        switch (value.type) {
            case 'del':
                return text + '(-' + value.value + ')';
            case 'ins':
                return text + '(+' + value.value + ')';
            case 'sub':
                return text + '(-+' + value.value + ')';
            case 'eql':
                return text + value.value;
        }
    }, '');
}

console.log('----------------------------------------------------------');
var start = 'This is a test for see how work the library',
    end = 'This is a test for know how work the new library';
console.log('start text,', start);
console.log('start text,', end);
console.log('sm.diff(start, end)');
var m = sm.diff(start, end);
console.log(m);
console.log('----------------------------------------------------------');
console.log(showResult(m));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');

var good = 'aGuillermo Gonzalez Jimenez',
    bad = 'Guillelmo   Gonzales   Jimenes';
console.log('good,', good);
console.log('bad,', bad);
console.log('sm.diffPercent(good, bad)');
sm.use();
console.log(sm.algorithm);
sm.algorithm.options.ignoreSpaces = true;
m = sm.diff(good, bad);
console.log(m);
console.log('----------------------------------------------------------');
console.log(showResult(m));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');

console.log('good,', good);
console.log('bad,', bad);
console.log('sm.diff(t1, t2)');
sm.use(lev({ignoreSpaces: true}));
m = sm.diff(good, bad);
console.log(m);
console.log('----------------------------------------------------------');
console.log(showResult(m));
console.log('----------------------------------------------------------');
console.log('----------------------------------------------------------');
