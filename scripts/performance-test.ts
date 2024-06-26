import Levenshtein from "../src/algorithms/levenshtein";
import {AlgorithmBase} from "../src/algorithms/algorithm";
import Greedy from "../src/algorithms/greedy";

let origin = "";
let dest = "";
const testIterations = 20;
const stringLength = 100;

for (let i = 0; i < stringLength; i++) {
    origin += getRandomChar();
    dest += getRandomChar();
}

let algorithm: AlgorithmBase;

console.log("Origin string length:", origin.length);
console.log(origin);
console.log("Dest string length:", dest.length);
console.log(dest);
console.log("");
algorithm = new Greedy();
let result = performance(testIterations);
console.log("algorithm:", "greedy");
console.log(`result: ${result}ms`);
console.log("distance:", algorithm.distance(origin, dest));
console.log("");
algorithm = new Levenshtein();
result = performance(testIterations);
console.log("algorithm:", "levenshtein");
console.log(`result: ${result}ms`);
console.log("distance:", algorithm.distance(origin, dest));

function getRandomChar() {
    const lowerChars = "abcdefghijklmnopqrstuvwxyz ";
    const upperChars = "ABCDRFGHIJKLMNOPQRSTUVWXYZ ";
    const upper = Math.floor(Math.random() * 2);
    const index = Math.floor(Math.random() * lowerChars.length);
    return upper ? upperChars.charAt(index) : lowerChars.charAt(index);
}

function performance(iterations: number) {
    let time = 0;
    for (let i = 0; i < iterations; i++) {
        const init = new Date();
        algorithm.differences(origin, dest);
        const end = new Date();
        time += end.getTime() - init.getTime();
    }
    return time / iterations;
}
