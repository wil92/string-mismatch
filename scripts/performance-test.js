var sm = require("../src/string-mismatch");

var origin = "";
var dest = "";

for (var i = 0; i < 5000; i++) {
    origin += getRandomChar();
    dest += getRandomChar();
}

var result = performance(10);
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
        sm.diff(origin, dest, 5);
        var end = new Date();
        time += end.getTime() - init.getTime();
    }
    return time / iterations;
}
