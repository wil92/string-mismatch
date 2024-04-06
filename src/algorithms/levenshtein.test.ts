import Levenshtein from "./levenshtein";
import {Operation} from "../utils/operation";
import {OperationType} from "../utils/operation-type";
import {compareChar} from "../utils/compare-char";

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
            const result = applyOperation(test.start, test.end, operations, lev.options.ignoreCase);
            expect(result).toEqual(test.end);
        });
    });
});

export function showResult(diffs: Operation[]) {
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

export function applyOperation(start: string, end: string, operations: Operation[], ignoreCase: boolean): string {
    let result = '';
    let startIt = 0;
    let endIt = 0;
    for (let op of operations) {
        switch (op.type) {
            case OperationType.EQL_NAME:
                expect(compareChar(start.substring(startIt, startIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
            case OperationType.DEL_NAME:
                expect(compareChar(start.substring(startIt, startIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                startIt += op.value.length;
                break;
            case OperationType.INS_NAME:
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                endIt += op.value.length;
                break;
            case OperationType.SUB_NAME:
                expect(compareChar(start.substring(startIt, startIt + (op.previousValue || '').length), op.previousValue || '', ignoreCase)).toBeTruthy();
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
        }
    }
    return result;
}

export const testCases: { start: string, end: string, distance: number }[] = [
    {start: "my", end: "you", distance: 3},
    {start: "a", end: "b", distance: 1},
    {start: "1234", end: "1233", distance: 1},
    {start: "kitten", end: "mittens", distance: 2},
    {start: "hello", end: "seldom", distance: 3},
    {start: "workattech", end: "workattech", distance: 0},
    {start: "abc", end: "def", distance: 3},
    {start: "ab", end: "ba", distance: 2},
    {start: "workat", end: "word", distance: 3},
    {
        start: "wmzIGWrCOCRAj LAuceRz fDarCnmRWggMbjcWidvc kSSIDZBBxWmCfOhAjfn tUttTsLkeMvnCPKnnyKbKj ovpKxMRcVyROIc",
        end: "qnlqMVsWdCqDcaXVIpaQuMzwOah xxHKPTNfJwFSWBPNPc JnvUuyBMYlVdvuSLveRnGJ R cqUujCDbYDqaedPhNDVxA YGFsej",
        distance: 92
    },
];
