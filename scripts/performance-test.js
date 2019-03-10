import sm from "../src/string-mismatch";
import {Levenshtein} from "../src/algorithms/levenshtein";

let origin = "";
let dest = "";

for (let i = 0; i < 1000; i++) {
    origin += getRandomChar();
    dest += getRandomChar();
}

console.log("Origin string length:", origin.length);
console.log("Dest string length:", dest.length);
console.log("");
let result = performance(20);
console.log("algorithm", "greedy");
console.log("result", result);
console.log("");
sm.use(new Levenshtein());
result = performance(20);
console.log("algorithm", "levenshtein");
console.log("result", result);

function getRandomChar() {
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDRFGHIJKLMNOPQRSTUVWXYZ";
    const upper = Math.floor(Math.random() * 2);
    const index = Math.floor(Math.random() * lowerChars.length);
    return upper ? upperChars.charAt(index) : lowerChars.charAt(index);
}

function performance(iterations) {
    let time = 0;
    for (let i = 0; i < iterations; i++) {
        const init = new Date();
        sm.diff(origin, dest);
        const end = new Date();
        time += end.getTime() - init.getTime();
    }
    return time / iterations;
}
