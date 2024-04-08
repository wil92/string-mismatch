import {AlgorithmOptions} from "../utils/algorithm-options";
import {AlgorithmBase} from "./algorithm";
import {eraseSpaces} from "../utils/erase-spaces";
import {Operation} from "../utils/operation";

/**
 * DiceCoefficient algorithm.
 * The DiceCoefficient algorithm is a method for finding the similarity between two strings.
 * @see https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 */
export default class DiceCoefficient implements AlgorithmBase {

    constructor(private options: AlgorithmOptions = {ignoreSpaces: false, ignoreCase: true} as AlgorithmOptions) {}

    /**
     * The method is not supported for this algorithm.
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns an exception because this algorithm doesn't have support for the method.
     */
    public differences(startText: string, endText: string): Operation[] {
        throw new Error('This algorithm didn\'t have implementation for the differences method')
    }

    /**
     * Calculate the similarity between two strings.
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns a number between 0 and 1 that represents the similarity between two strings.
     */
    public distance(startText: string, endText: string): number {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        return this.diceCoefficientAlgorithm(startText, endText);
    }

    /**
     * Calculate the similarity between two strings.
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns a number between 0 and 1 that represents the similarity between two strings.
     */
    diceCoefficientAlgorithm(startText: string, endText: string): number {
        const startSet = new Set();
        const endSet = new Set();
        let intersection = 0;
        for (let i = 0; i < startText.length - 1; i++) {
            startSet.add(startText[i] + startText[i + 1]);
        }
        for (let i = 0; i < endText.length - 1; i++) {
            endSet.add(endText[i] + endText[i + 1]);
        }
        for (let pair of Array.from(endSet)) {
            intersection += startSet.has(pair) ? 1 : 0;
        }
        return 2 * intersection / (startSet.size + endSet.size);
    }
}
