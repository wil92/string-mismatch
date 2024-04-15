import DiceCoefficient from "./dice-coefficient";
import {AlgorithmOptions} from "../utils/algorithm-options";

describe("DiceCoefficient", function () {

    it("should validate the wiki example", function () {
        const algorithm = new DiceCoefficient();
        expect(algorithm.distance("night", "nacht")).toEqual(0.25);
    });

    it("should return the string distance ignoring spaces", function () {
        const algorithm = new DiceCoefficient({ignoreSpaces: true} as AlgorithmOptions);
        expect(algorithm.distance("sten ", " end")).toEqual(0.4);
    });
});
