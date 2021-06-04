import {Greedy} from "./algorithms/greedy";
import {Levenshtein} from "./algorithms/levenshtein";

describe("string-mismatch.js", () => {
    let greedy: Greedy;
    let lev: Levenshtein;

    beforeAll(function () {
        greedy = new Greedy();
        lev = new Levenshtein();
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

    describe("levenshtein integration tests", function () {
        it("should check defferences with real data", function () {
            const start = "my",
                end = "you";
            expect(lev.differences(start, end)).toEqual([
                {type: "sub", value: "my"},
                {type: "ins", value: "o"},
                {type: "sub", value: "yu"}
            ]);
        });

        it("should check differences with real data (bug in production)", function () {
            const start = "my name is juan",
                end = "mi nombre es juan";
            expect(lev.differences(start, end)).toEqual([
                {type: "eql", value: "m"}, {type: "sub", value: "yi"}, {type: "eql", value: " n"},
                {type: "sub", value: "ao"}, {type: "eql", value: "m"}, {type: "ins", value: "br"},
                {type: "eql", value: "e "}, {type: "sub", value: "ie"}, {type: "eql", value: "s juan"}
            ]);
        });

        it("should check differences between two strings of one character", function () {
            const start = "m",
                end = "n";
            expect(lev.differences(start, end)).toEqual([{type: "sub", value: "mn"}]);
        });

        it("should check differences between two  equal strings ignoring the spaces", function () {
            lev = new Levenshtein({ignoreSpaces: true, ignoreCase: false});
            const start = "  m   ",
                end = "m";
            expect(lev.differences(start, end)).toEqual([{type: "eql", value: "m"}]);
        });

        it("should not find any difference between two string of one character", function () {
            const start = "m",
                end = "m";
            expect(lev.differences(start, end)).toEqual([{type: "eql", value: "m"}]);
        });

        it("should not find any difference between two string if ignoreCase is true", function () {
            lev = new Levenshtein({ignoreSpaces: false, ignoreCase: true});
            const start = "M",
                end = "m";
            expect(lev.differences(start, end)).toEqual([{type: "eql", value: "M"}]);
        });

        it("should find a mismatch with ignoreCase in false", function () {
            lev = new Levenshtein({ignoreSpaces: false, ignoreCase: false});
            const start = "M",
                end = "m";
            expect(lev.differences(start, end)).toEqual([{type: "sub", value: "Mm"}]);
        });

        it("should not find any difference between two string of one character", function () {
            const start = "my name is john";
            expect(lev.differences(start, start)).toEqual([{type: "eql", value: "my name is john"}]);
        });
    });
});
