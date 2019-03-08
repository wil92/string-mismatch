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
        expect(lev.calculateMatrix(start, end)).to.deep.equal([[3, 2, 2], [3, 2, 1]]);
    });

    it('should calculate the matrix dp (from bug)', function () {
        var start = "my name is juan",
            end = "mi nombre es juan";
        var result = [
            [5, 6, 6, 7, 7, 6, 7, 7, 7, 7, 8, 9, 10, 11, 12, 13, 14],
            [6, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13],
            [6, 5, 4, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12],
            [7, 6, 5, 4, 5, 4, 4, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11],
            [8, 7, 6, 5, 4, 4, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10],
            [8, 7, 6, 5, 4, 3, 3, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 2, 3, 4, 5, 6, 7, 8],
            [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 2, 3, 4, 5, 6, 7],
            [10, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6],
            [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5],
            [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
            [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3],
            [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2],
            [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1],
            [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
        expect(lev.calculateMatrix(start, end)).to.deep.equal(result);
    });

    it('should calculate the string differences form 2', function () {
        var start = "my name is juan",
            end = "mi nombre es juan";
        lev.dp = lev.calculateMatrix(start, end);
        expect(lev.reconstructSolution(start, end)).to.deep.equal([
            {type: 'eql', value: 'm'}, {type: 'sub', value: 'yi'}, {type: 'eql', value: ' '},
            {type: 'eql', value: 'n'}, {type: 'sub', value: 'ao'}, {type: 'eql', value: 'm'},
            {type: 'ins', value: 'b'}, {type: 'ins', value: 'r'}, {type: 'eql', value: 'e'},
            {type: 'eql', value: ' '}, {type: 'sub', value: 'ie'}, {type: 'eql', value: 's'},
            {type: 'eql', value: ' '}, {type: 'eql', value: 'j'}, {type: 'eql', value: 'u'},
            {type: 'eql', value: 'a'}, {type: 'eql', value: 'n'}
        ]);
    });

    it('should calculate the string differences form 3', function () {
        var start = "my",
            end = "you";
        lev.dp = lev.calculateMatrix(start, end);
        expect(lev.reconstructSolution(start, end)).to.deep.equal([
            {type: 'sub', value: 'my'},
            {type: 'ins', value: 'o'},
            {type: 'sub', value: 'yu'}
        ]);
    });

    it('should resume the string differences', function () {
        var start = "moy",
            end = "you";
        expect(lev.differences(start, end)).to.deep.equal([
            {type: 'sub', value: 'my'},
            {type: 'eql', value: 'o'},
            {type: 'sub', value: 'yu'}
        ]);
    });

    it("check diffPercent with real data bug in production", function () {
        var start = "my name is juan",
            end = "mi nombre es juan";
        // noinspection JSUnresolvedVariable
        expect(lev.differences(start, end)).to.deep.equal([
            {type: 'eql', value: 'm'}, {type: 'sub', value: 'yi'}, {type: 'eql', value: ' n'},
            {type: 'sub', value: 'ao'}, {type: 'eql', value: 'm'}, {type: 'ins', value: 'br'},
            {type: 'eql', value: 'e '}, {type: 'sub', value: 'ie'}, {type: 'eql', value: 's juan'}
        ]);
    });
});
