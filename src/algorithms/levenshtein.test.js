const chai = require("chai");

const expect = chai.expect;

describe("levenshtein.js", function () {
    let lev;

    beforeEach(function () {
        lev = require('./levenshtein')();
    });

    it('should calculate the matrix dp', function () {
        var start = "my",
            end = "you";
        expect(lev.calculateMatrix(start, end)).to.deep.equal([[3, 2, 2, 2], [2, 2, 1, 1], [3, 2, 1, -1]]);
    });

    it('should calculate the matrix dp (from bug)', function () {
        var start = "my name is juan",
            end = "mi nombre es juan";
        var result = [
            [5, 6, 6, 7, 7, 6, 7, 7, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            [6, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            [6, 5, 4, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            [7, 6, 5, 4, 5, 4, 4, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12],
            [8, 7, 6, 5, 4, 4, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11],
            [8, 7, 6, 5, 4, 3, 3, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9],
            [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 2, 3, 4, 5, 6, 7, 8],
            [10, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7],
            [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6],
            [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5],
            [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
            [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3],
            [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2],
            [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1],
            [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1]];
        expect(lev.calculateMatrix(start, end)).to.deep.equal(result);
    });

    it('should calculate the string differences form ', function () {
        var start = "my",
            end = "you";
        lev.dp = lev.calculateMatrix(start, end);
        expect(lev.reconstructSolution(start, start.length, end, end.length)).to.deep.equal([{eq: '', del: 'm', ins: ''},
            {eq: '', del: '', ins: 'y'},
            {eq: '', del: '', ins: 'o'},
            {eq: '', del: 'y', ins: ''},
            {eq: '', del: '', ins: 'u'}
        ]);
    });

    it('should resume the string differences', function () {
        var start = "moy",
            end = "you";
        expect(lev.differences(start, end)).to.deep.equal([
            {mtc: '', del: 'm', ins: 'y', sbs: 'o'},
            {mtc: '', del: 'y', ins: 'u', sbs: ''}
        ]);
    });

    it("check diffPercent with real data bug in production", function () {
        var start = "my name is juan",
            end = "mi nombre es juan",
            expected = [{"del": "y", "ins": "i", "mtc": "m", "sbs": " n"}, {
                "del": "am",
                "ins": "ombr",
                "mtc": "",
                "sbs": "e "
            }, {"del": "i", "ins": "e", "mtc": "", "sbs": "s juan"}];
        // noinspection JSUnresolvedVariable
        expect(lev.differences(start, end)).to.deep.equal(expected);
    });
});
