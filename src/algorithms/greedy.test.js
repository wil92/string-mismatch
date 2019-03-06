const chai = require("chai");

const expect = chai.expect;

describe("greedy.js", function() {
    let greedy;

    beforeEach(function () {
        greedy = require('./greedy')();
    });

    it("check getMatchingSubstring method for find matches", function(){
        var start = "poasdf fdfsaf",
            end = "bgasdfsdfs",
            mValue = 0;
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        expect(greedy.getMatchingSubstring(start, end, 0, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it("check diff function with real values 1", function(){
        var start = "This is a test for see how work the library",
            end = "This is a test for know how work the new library",
            expected = [ { mtc: "This is a test for ", del: "see", ins: "know", sbs: " how work the " }, { mtc: "", del: "", ins: "new ", sbs: "library" } ],
            precision = 5;
        // noinspection JSUnresolvedVariable
        expect(greedy.differences(start, end, precision)).to.deep.equal(expected);
    });

    it("check diff function with real values without precision parameter", function(){
        var start = "This is a test for see how work the library",
            end = "This is a test for know how work the new library",
            expected = [ { mtc: "This is a test for ", del: "see", ins: "know", sbs: " how work the " }, { mtc: "", del: "", ins: "new ", sbs: "library" } ];
        // noinspection JSUnresolvedVariable
        expect(greedy.differences(start, end)).to.deep.equal(expected);
    });
});
