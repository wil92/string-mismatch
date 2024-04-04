import Levenshtein from "./levenshtein";
import {Operation} from "../utils/operation";
import {OperationType} from "../utils/operation-type";

describe("Levenshtein", function () {
    let lev: Levenshtein;

    beforeEach(function () {
        lev = new Levenshtein();
    });

    it("should validate battery of test cases (distance)", function () {
        testCases.forEach(test => {
            expect(lev.distance(test.start, test.end)).toEqual(test.distance);
        });
    });

    it("should validate battery of test cases (difference)", function () {
        testCases.forEach(test => {
            // console.log(test.start, test.end);
            const operations = lev.differences(test.start, test.end);
            // console.log(showResult(operations));
            const result = applyOperation(test.start, test.end, operations);
            expect(result).toEqual(test.end);
        });
    });
});


function showResult(diffs: Operation[]) {
    return diffs.reduce((text: string, value: Operation): string => {
        switch (value.type) {
            case "del":
                return `${text}(-${value.value})`;
            case "ins":
                return `${text}(+${value.value})`;
            case "sub":
                return `${text}(-${value.previousValue}+${value.value})`;
            case "eql":
                return text + value.value;
        }
        return '';
    }, "");
}

function applyOperation(start: string, end: string, operations: Operation[]): string {
    let result = '';
    let startIt = 0;
    let endIt = 0;
    for (let op of operations) {
        switch (op.type) {
            case OperationType.EQL_NAME:
                expect(start.substring(startIt, startIt + op.value.length)).toEqual(op.value);
                expect(end.substring(endIt, endIt + op.value.length)).toEqual(op.value);
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
            case OperationType.DEL_NAME:
                expect(start.substring(startIt, startIt + op.value.length)).toEqual(op.value);
                startIt += op.value.length;
                break;
            case OperationType.INS_NAME:
                expect(end.substring(endIt, endIt + op.value.length)).toEqual(op.value);
                result += op.value;
                endIt += op.value.length;
                break;
            case OperationType.SUB_NAME:
                expect(start.substring(startIt, startIt + (op.previousValue || '').length)).toEqual(op.previousValue);
                expect(end.substring(endIt, endIt + op.value.length)).toEqual(op.value);
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
        }
    }
    return result;
}

const testCases: { start: string, end: string, distance: number }[] = [
    {start: "my", end: "you", distance: 3},
    {start: "a", end: "b", distance: 1},
    {start: "1234", end: "1233", distance: 1},
    {start: "kitten", end: "mittens", distance: 2},
    {start: "hello", end: "seldom", distance: 3},
    {start: "workattech", end: "workattech", distance: 0},
    {start: "abc", end: "def", distance: 3},
    {start: "ab", end: "ba", distance: 2},
    {start: "workat", end: "word", distance: 3},
];
