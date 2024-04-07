import Levenshtein from "./levenshtein";
import {OperationType} from "../utils/operation-type";

import testCases from '../../test-utils/test-examples.json';
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

    it("should validate battery of test cases (ignoreCase=true) (difference)", function () {
        testCases.forEach(test => {
            const operations = lev.differences(test.start, test.end);
            for (let op of operations) {
                if (op.type === OperationType.SUB_NAME || op.type === OperationType.EQL_NAME) {
                    expect(op.previousValue).toBeTruthy();
                }
                if (op.type === OperationType.SUB_NAME && op.previousValue) {
                    expect(op.value.length).toEqual(op.previousValue.length);
                } else if (op.type === OperationType.EQL_NAME && op.previousValue) {
                    expect(compareChar(op.value, op.previousValue, lev.options.ignoreCase)).toBeTruthy();
                }
            }
            const result = applyOperations(test.start, test.end, operations, lev.options.ignoreCase);
            expect(result).toEqual(test.end);
        });
    });

    it("should validate battery of test cases (ignoreCase=false) (difference)", function () {
        testCases.forEach(test => {
            lev.options.ignoreCase = false;
            const operations = lev.differences(test.start, test.end);
            const result = applyOperations(test.start, test.end, operations, lev.options.ignoreCase);
            expect(result).toEqual(test.end);
        });
    });

    it("should validate battery of test cases (ignoreCase=true) (enableSubstitution=false) (difference)", function () {
        testCases.forEach(test => {
            lev.options.enableSubstitution = false;
            lev.options.ignoreCase = true;
            const operations = lev.differences(test.start, test.end);
            for (let op of operations) {
                expect(op.type).not.toEqual(OperationType.SUB_NAME);
            }
            const result = applyOperations(test.start, test.end, operations, lev.options.ignoreCase);
            expect(result).toEqual(test.end);
        });
    });
});
