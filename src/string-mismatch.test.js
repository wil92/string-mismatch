import chai from "chai";
import spy from "chai-spies";

import sm from "./string-mismatch";
import Greedy from "./algorithms/greedy";
import Lev from "./algorithms/levenshtein";


chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("string-mismatch.js", function () {
    let greedy;
    let lev;
    let smi;

    beforeEach(function () {
        smi = new sm();
        greedy = Greedy();
        lev = Lev();
    });

    afterEach(function () {
        chai.spy.restore(greedy);
        chai.spy.restore(lev);
    });

    it("should return differences between two strings with greedy algorithm", function () {
        chai.spy.on(greedy, "differences", noop);
        smi.use(greedy);
        expect(smi.diff("start", "end"));
        expect(greedy.differences).to.have.been.called();
    });

    it("should return differences between two strings with levenshtein algorithm", function () {
        chai.spy.on(lev, "differences", noop);
        smi.use(lev);
        expect(smi.diff("start", "end"));
        expect(lev.differences).to.have.been.called();
    });

    it("should use greedy algorithm by default if the parameters of the use() method are empty", function () {
        chai.spy.on(greedy, "differences", noop);
        smi.use();
        smi.diff("start", "end");
        expect(greedy.differences).to.have.been.called();
    });
});
