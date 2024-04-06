import Greedy from "./algorithms/greedy";

describe("string-mismatch.js", () => {
    let greedy: Greedy;

    beforeAll(function () {
        greedy = new Greedy();
    });

    describe("Greedy integration tests", function () {
        it("should check differences between two strings", () => {
            const start = "This is a test for see how work the library",
                end = "This is a test for know how work the new library";
            expect(greedy.differences(start, end)).toEqual([
                {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
                {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
                {type: "ins", value: "new "}, {type: "eql", value: "library"}
            ]);
        });

        it("should check differences between two strings ignoring the spaces", () => {
            const greedy = new Greedy({ignoreSpaces: true, ignoreCase: false});
            const start = "   This is a test   for see how work the library   ",
                end = "    This is a test for know how work the new library      ";
            expect(greedy.differences(start, end)).toEqual([
                {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
                {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
                {type: "ins", value: "new "}, {type: "eql", value: "library"}
            ]);
        });

        it("should return the differences between two strings with ignore case as true", () => {
            const greedy = new Greedy({ignoreSpaces: false, ignoreCase: true});
            const start = "This is a test for see how work the library",
                end = "this is a test for know how work the new library";
            expect(greedy.differences(start, end)).toEqual([
                {type: "eql", value: "this is a test for "}, {type: "del", value: "see"},
                {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
                {type: "ins", value: "new "}, {type: "eql", value: "library"}
            ]);
        });
    });
});
