const chai = require("chai");

const expect = chai.expect;

describe("greedy.js", function () {
    let greedy;

    beforeEach(function () {
        greedy = require("./greedy")();
    });

    it("should check getMatchingSubstring method for find matches", function () {
        var start = "poasdf fdfsaf",
            end = "bgasdfsdfs",
            mValue = 0;
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        expect(greedy.getMatchingSubstring(start, end, 0, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it("should check differences between two strings", function () {
        var start = "This is a test for see how work the library",
            end = "This is a test for know how work the new library";
        // noinspection JSUnresolvedVariable
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });

    it("should check differences between two strings ignoring the spaces", function () {
        var start = "   This is a test   for see how work the library   ",
            end = "    This is a test for know how work the new library      ";
        greedy.options.ignoreSpaces = true;
        // noinspection JSUnresolvedVariable
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "This is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });

    it("should return the differences between two strings with ignore case as true", function () {
        var start = "This is a test for see how work the library",
            end = "this is a test for know how work the new library";
        // noinspection JSUnresolvedVariable
        greedy.options.ignoreCase = true;
        expect(greedy.differences(start, end)).to.deep.equal([
            {type: "eql", value: "this is a test for "}, {type: "del", value: "see"},
            {type: "ins", value: "know"}, {type: "eql", value: " how work the "},
            {type: "ins", value: "new "}, {type: "eql", value: "library"}
        ]);
    });
});
