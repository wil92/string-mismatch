var sm = require("../src/string-mismatch");

var origin = "";
var dest = "";

for (var i = 0; i < 1000; i++) {
    origin += getRandomChar();
    dest += getRandomChar();
}

var result = performance(20);
console.log('algorithm', 'greedy');
console.log("result", result);
console.log('');
sm.use(require("../src/algorithms/levenshtein")());
result = performance(20);
console.log('algorithm', 'levenshtein');
console.log("result", result);

function getRandomChar() {
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var upperChars = "ABCDRFGHIJKLMNOPQRSTUVWXYZ";
    var upper = Math.round(Math.random() * 2);
    var index = Math.round(Math.random() * lowerChars.length);
    return upper ? upperChars.charAt(index) : lowerChars.charAt(index);
}

function performance(iterations) {
    var time = 0;
    for (var i = 0; i < iterations; i++) {
        var init = new Date();
        sm.diff(origin, dest);
        var end = new Date();
        time += end.getTime() - init.getTime();
    }
    return time / iterations;
}
