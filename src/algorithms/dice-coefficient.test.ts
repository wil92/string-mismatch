import {DiceCoefficient} from "./dice-coefficient";
import {AlgorithmOptions} from "../utils/algorithm-options";

describe("DiceCoefficient", function () {

    it("should call the diceCoefficientAlgorithm method", function () {
        const algorithm = new DiceCoefficient();
        jest.spyOn(algorithm, 'diceCoefficientAlgorithm').mockReturnValue(0.5);
        expect(algorithm.distance("start", "end")).toEqual(0.5);
        expect(algorithm.diceCoefficientAlgorithm).toBeCalled();
    });

    it("should return the string distance", function () {
        const algorithm = new DiceCoefficient();
        expect(algorithm.diceCoefficientAlgorithm("sten", "end")).toEqual(0.4);
    });

    it("should return the string distance ignoring spaces", function () {
        const algorithm = new DiceCoefficient({ignoreSpaces: true} as AlgorithmOptions);
        expect(algorithm.distance("sten ", " end")).toEqual(0.4);
    });
});
