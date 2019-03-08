const chai = require("chai");
const spy = require("chai-spies");

const sm = require("./string-mismatch");

chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("string-mismatch.js", function () {
    let greedy;
    let lev;
    beforeEach(function () {
        greedy = require("./algorithms/greedy");
        lev = require("./algorithms/levenshtein");
    });

    afterEach(function () {
        chai.spy.restore(greedy);
        chai.spy.restore(lev);
    });

    it("should return differences between two strings with greedy algorithm", function () {
        var alg = greedy();
        chai.spy.on(alg, "differences", noop);
        sm.use(alg);
        expect(sm.diff("start", "end"));
        expect(alg.differences).to.have.been.called();
    });

    it("should return differences between two strings with levenshtein algorithm", function () {
        var alg = lev();
        chai.spy.on(alg, "differences", noop);
        sm.use(alg);
        expect(sm.diff("start", "end"));
        expect(alg.differences).to.have.been.called();
    });
});
