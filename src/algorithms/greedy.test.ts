import Greedy from "./greedy";
import {Operation} from "../utils/operation";
import {applyOperation, showResult, testCases} from "./levenshtein.test";
import {compareChar} from "../utils/compare-char";

describe("Greedy", () => {
    let greedy: Greedy;

    beforeEach(() => {
        greedy = new Greedy();
    });

    it("should check the distance method", function () {
        jest.spyOn(greedy, "differences").mockReturnValue([
            {type: "ins", value: "my"} as Operation,
            {type: "ins", value: "o"} as Operation,
            {type: "del", value: "yu"} as Operation
        ]);
        expect(greedy.distance("start", "end")).toEqual(5);
    });

    it("should validate battery of test cases (ignoreCase=true) (difference)", function () {
        testCases.forEach(test => {
            const operations = greedy.differences(test.start, test.end);
            const result = applyOperation(test.start, test.end, operations, greedy.options.ignoreCase);
            expect(compareChar(result, test.end, greedy.options.ignoreCase));
        });
    });

    it("should validate battery of test cases (ignoreCase=false) (difference)", function () {
        testCases.forEach(test => {
            // console.log(test.start, test.end);
            greedy.options.ignoreCase = false;
            const operations = greedy.differences(test.start, test.end);
            // console.log(showResult(operations));
            const result = applyOperation(test.start, test.end, operations, greedy.options.ignoreCase);
            expect(compareChar(result, test.end, greedy.options.ignoreCase));
        });
    });
});
