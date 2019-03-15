import chai from "chai";
import spy from "chai-spies";

import Greedy from "./greedy";

chai.use(spy);
const expect = chai.expect;

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

    it("should check the distance method", function () {
        chai.spy.on(greedy, "diff", () => [{type: "ins", value: "my"}, {type: "ins", value: "o"}, {type: "del", value: "yu"}]);
        expect(greedy.distance("start", "end")).to.deep.equal(5);
    });
});
