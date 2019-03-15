import chai from "chai";
import spy from "chai-spies";

import Greedy from "./greedy";
import {compareChar} from "../utils/string";

chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("greedy.js", () => {
    let greedy;

    beforeEach(() => {
        greedy = new Greedy();
    });

    it("should check getMatchingSubstring method for find matches", () => {
        const start = "poasdf fdfsaf",
            end = "bgasdfsdfs",
            mValue = 0;
        expect(greedy.getMatchingSubstring(start, end, 0, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it("should check differences method", function () {
        chai.spy.on(greedy, "diff", () => [{type: "del", value: "see"}]);
        expect(greedy.differences("start", "end")).to.deep.equal([{type: "del", value: "see"}]);
        expect(greedy.diff).to.have.been.called();
    });
});
