import chai from "chai";
import spy from "chai-spies";

import {StringMismatch} from "./string-mismatch";
import Greedy from "./algorithms/greedy";
import Lev from "./algorithms/levenshtein";


chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("string-mismatch.js", () => {
    let greedy;
    let lev;
    let sm;

    beforeEach(function () {
        sm = new StringMismatch();
        greedy = new Greedy();
        lev = new Lev();
    });

    afterEach(function () {
        chai.spy.restore(greedy);
        chai.spy.restore(lev);
    });

    it("should return differences between two strings with greedy algorithm", () => {
        chai.spy.on(greedy, "differences", noop);
        sm.use(greedy);
        expect(sm.diff("start", "end"));
        expect(greedy.differences).to.have.been.called();
    });

    it("should return differences between two strings with levenshtein algorithm", () => {
        chai.spy.on(lev, "differences", noop);
        sm.use(lev);
        expect(sm.diff("start", "end"));
        expect(lev.differences).to.have.been.called();
    });

    it("should use greedy algorithm by default if the parameters of the use() method are empty", () => {
        chai.spy.on(greedy, "differences", noop);
        sm.use(greedy);
        sm.diff("start", "end");
        expect(greedy.differences).to.have.been.called();
    });
});
