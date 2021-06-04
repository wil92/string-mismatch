import {Levenshtein} from "./levenshtein";
import {Operation} from "../utils/operation";

describe("Levenshtein", function () {
    let lev: Levenshtein;

    beforeEach(function () {
        lev = new Levenshtein();
    });

    it("should calculate the matrix dp", function () {
        const start = "my",
            end = "you";
        expect(lev.calculateMatrix(start, end)).toEqual([[3, 2, 2], [3, 2, 1]]);
    });

    it("should calculate the matrix dp (from bug)", function () {
        jest.spyOn(lev, "calculateLevenshtein").mockImplementation();
        const start = "a",
            end = "b";
        expect(lev.calculateMatrix(start, end)).toEqual([[-1]]);
        expect(lev.calculateLevenshtein).toHaveBeenCalled()
    });

    it("should return the string distance", function () {
        jest.spyOn(lev, "calculateMatrix").mockImplementation();
        lev.dp = [[5]];
        expect(lev.distance("start", "end")).toEqual(5);
        expect(lev.calculateMatrix).toHaveBeenCalled();
    });

    it("should reconstruct solution from the matrix of mismatch example 2", function () {
        const start = "my",
            end = "you";
        lev.dp = [[3, 2, 2], [3, 2, 1]];
        expect(lev.reconstructSolution(start, end)).toEqual([
            {type: "sub", value: "my"},
            {type: "ins", value: "o"},
            {type: "sub", value: "yu"}
        ]);
    });

    it("should check difference between two strings", function () {
        jest.spyOn(lev, "calculateMatrix").mockImplementation();
        jest.spyOn(lev, "reconstructSolution").mockImplementation();
        jest.spyOn(lev, "joinSolution").mockReturnValue([{type: "sub", value: "my"} as Operation]);
        const start = "moy",
            end = "you";
        expect(lev.differences(start, end)).toEqual([{type: "sub", value: "my"}]);
        expect(lev.calculateMatrix).toHaveBeenCalled();
        expect(lev.reconstructSolution).toHaveBeenCalled();
        expect(lev.joinSolution).toHaveBeenCalled();
    });
});
