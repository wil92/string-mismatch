import chai from "chai";

import Greedy from "./greedy";

const expect = chai.expect;

describe("greedy.js", () => {
    let greedy;

    beforeEach(() => {
        greedy = new Greedy();
    });

    it("should check getMatchingSubstring method for find matches", () => {
        const start = "poasdf fdfsaf",
            end = "bgasdfsdfs",
            mValue = 0;
        expect(greedy.getMatchingSubstring(start, end, 0, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it("should check differences between two strings", () => {
        const start = "This is a test for see how work the library",
            end = "This is a test for know how work the new library";
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });

    it("should check differences between two strings ignoring the spaces", () => {
        const start = "   This is a test   for see how work the library   ",
            end = "    This is a test for know how work the new library      ";
        greedy.options.ignoreSpaces = true;
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });

    it("should return the differences between two strings with ignore case as true", () => {
        const start = "This is a test for see how work the library",
            end = "this is a test for know how work the new library";
        greedy.options.ignoreCase = true;
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "this is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });
});
