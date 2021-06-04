import Greedy from "./greedy";
import {Operation} from "../utils/operation";

describe("Greedy", () => {
    let greedy: Greedy;

    beforeEach(() => {
        greedy = new Greedy();
    });

    it("should check getMatchingSubstring method for find matches", () => {
        const start = "poasdf fdfsaf",
            end = "bgasdfsdfs",
            mValue = 'domr';
        expect(greedy.getMatchingSubstring(start, end, 0, mValue)).toEqual({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it("should check the distance method", function () {
        jest.spyOn(greedy, "differences").mockReturnValue([
            {type: "ins", value: "my"} as Operation,
            {type: "ins", value: "o"} as Operation,
            {type: "del", value: "yu"} as Operation
        ]);
        expect(greedy.distance("start", "end")).toEqual(5);
    });
});
