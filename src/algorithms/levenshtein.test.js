import chai from "chai";
import spy from "chai-spies";

import {Levenshtein} from "./levenshtein";

chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("levenshtein.js", function () {
    let lev;

    beforeEach(function () {
        lev = new Levenshtein();
    });

    it("should calculate the matrix dp", function () {
        const start = "my",
            end = "you";
        expect(lev.calculateMatrix(start, end)).to.deep.equal([[3, 2, 2], [3, 2, 1]]);
    });

    it("should calculate the matrix dp (from bug)", function () {
        chai.spy.on(lev, "calculateLevenshtein", noop);
        const start = "a",
            end = "b";
        expect(lev.calculateMatrix(start, end)).to.deep.equal([[-1]]);
        expect(lev.calculateLevenshtein).to.have.been.called();
    });

    it("should return the string distance", function () {
        chai.spy.on(lev, "calculateMatrix", noop);
        lev.dp = [[5]];
        expect(lev.distance("start", "end")).to.deep.equal(5);
        expect(lev.calculateMatrix).to.have.been.called();
    });

    it("should reconstruct solution from the matrix of mismatch example 2", function () {
        const start = "my",
            end = "you";
        lev.dp = [[3, 2, 2], [3, 2, 1]];
        expect(lev.reconstructSolution(start, end)).to.deep.equal([
            {type: "sub", value: "my"},
            {type: "ins", value: "o"},
            {type: "sub", value: "yu"}
        ]);
    });

    it("should check difference between two strings", function () {
        chai.spy.on(lev, "calculateMatrix", noop);
        chai.spy.on(lev, "reconstructSolution", noop);
        chai.spy.on(lev, "joinSolution", () => [{type: "sub", value: "my"}]);
        const start = "moy",
            end = "you";
        expect(lev.differences(start, end)).to.deep.equal([{type: "sub", value: "my"}]);
        expect(lev.calculateMatrix).to.have.been.called();
        expect(lev.reconstructSolution).to.have.been.called();
        expect(lev.joinSolution).to.have.been.called();
    });
});
