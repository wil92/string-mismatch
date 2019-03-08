const chai = require("chai");

const sm = require("./string-mismatch");

const expect = chai.expect;

describe("string-mismatch tests", function() {
    let greedy;
    let lev;
    beforeEach(function () {
        greedy = require('./algorithms/greedy');
        lev = require('./algorithms/levenshtein');
    });

    it("check eraseSpace function", function(){
        var text = "      This     is    a    test      for    see how     work the library   ",
            expected = "This is a test for see how work the library";
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });

    it("check eraseSpace function empty string", function(){
        var text = "",
            expected = "";
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });

    it("check eraseSpace function only spaces", function(){
        var text = "       ",
            expected = "";
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });
});
