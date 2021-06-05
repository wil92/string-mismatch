const sm = require("../");
const lev = sm.Levenshtein;
const greedy = sm.Greedy;

function showResult(diffs) {
    return diffs.reduce(function (text, value) {
        switch (value.type) {
            case "del":
                return text + "(-" + value.value + ")";
            case "ins":
                return text + "(+" + value.value + ")";
            case "sub":
                return text + "(-+" + value.value + ")";
            case "eql":
                return text + value.value;
        }
    }, "");
}

console.log("----------------------------------------------------------");
const start = "This is a test for see how work the library",
    end = "This is a test for know how work the new library";
console.log("start text,", start);
console.log("start text,", end);
console.log("sm.diff(start, end)");
console.log(greedy);
const greedyInstance = new greedy();
let m = greedyInstance.differences(start, end);
console.log(m);
console.log("----------------------------------------------------------");
console.log(showResult(m));
console.log("----------------------------------------------------------");
console.log("----------------------------------------------------------");

const good = "aGuillermo Gonzalez Jimenez",
    bad = "Guillelmo   Gonzales   Jimenes";
console.log("good,", good);
console.log("bad,", bad);
console.log("sm.diffPercent(good, bad)");
let levInstance = new lev({ignoreSpaces: true});
m = levInstance.differences(good, bad);
console.log(m);
console.log("----------------------------------------------------------");
console.log(showResult(m));
console.log("----------------------------------------------------------");
console.log("----------------------------------------------------------");

console.log("good,", good);
console.log("bad,", bad);
console.log("sm.diff(t1, t2)");
levInstance = new lev();
m = levInstance.differences(good, bad);
console.log(m);
console.log("----------------------------------------------------------");
console.log(showResult(m));
console.log("----------------------------------------------------------");
console.log("----------------------------------------------------------");
