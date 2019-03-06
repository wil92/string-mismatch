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

    it("check diffPercent with real data", function(){
        sm.use(greedy);
        var start = "Guillermo Gonzalez Jimenez",
            end = "Guillelmo   Gonzales   Jimenes",
            expected = { good: true, percent: 0.11538461538461539, diffs: [ { mtc: "Guille", del: "r", ins: "l", sbs: "mo Gonzale" }, { mtc: "", del: "z", ins: "s", sbs: " Jimene" }, { mtc: "", del: "z", ins: "s", sbs: "" } ] };
        // noinspection JSUnresolvedVariable
        expect(sm.diffPercent(start, end, 0.6, 5)).to.deep.equal(expected);
    });

    it("check diffPercent with real data ignore case", function(){
        sm.use(greedy);
        var start = "guillermo Gonzalez jimEnEz",
            end = "Guillelmo   gonzales   Jimenes",
            expected = {"diffs": [{"del": "r", "ins": "l", "mtc": "Guille", "sbs": "mo gonzale"}, {"del": "z", "ins": "s", "mtc": "", "sbs": " Jimene"}, {"del": "z", "ins": "s", "mtc": "", "sbs": ""}], "good": true, "percent": 0.11538461538461539};
        // noinspection JSUnresolvedVariable
        expect(sm.diffPercent(start, end, 0.6, 5, true)).to.deep.equal(expected);
    });

    it("check diffPercent with real data bug in production", function(){
        sm.use(greedy);
        var start = "my name is juan",
            end = "mi nombre es juan",
            expected = {"diffs": [{"del": "y", "ins": "i", "mtc": "m", "sbs": " n"}, {"del": "am", "ins": "ombr", "mtc": "", "sbs": "e "}, {"del": "i", "ins": "e", "mtc": "", "sbs": "s juan"}], "good": false, "percent": 0.4};
        // noinspection JSUnresolvedVariable
        expect(sm.diffPercent(start, end, 0.9, 2, true)).to.deep.equal(expected);
    });

    it("should return diffPercent false with real data (bug in production)", function(){
        sm.use(greedy);
        var start = "animal",
            end = "n",
            expected = {"diffs": [{"del": "a", "ins": "", "mtc": "", "sbs": "n"}, {"del": "imal", "ins": "", "mtc": "", "sbs": ""}], "good": false, "percent": 0.8333333333333334};
        // noinspection JSUnresolvedVariable
        expect(sm.diffPercent(start, end, 0.6, 5, true)).to.deep.equal(expected);
    });
});
