import chai from "chai";
import spy from "chai-spies";

import {DiceCoefficient} from "./dice-coefficient";

chai.use(spy);
const expect = chai.expect;

describe("dice-coefficient.js", function () {
    let dice;

    beforeEach(function () {
        dice = new DiceCoefficient();
    });

    it("should call the diceCoefficientAlgorithm method", function () {
        chai.spy.on(dice, "diceCoefficientAlgorithm", () => 0.5);
        expect(dice.distance("start", "end")).equal(0.5);
        expect(dice.diceCoefficientAlgorithm).to.have.been.called();
    });

    it("should return the string distance", function () {
        expect(dice.diceCoefficientAlgorithm("sten", "end")).equal(0.4);
    });

    it("should return the string distance ignoring spaces", function () {
        dice.options["ignoreSpaces"] = true;
        expect(dice.distance("sten ", " end")).equal(0.4);
    });
});
