import {AlgorithmOptions} from "../utils/algorithm-options";
import {AlgorithmBase} from "./algorithm";
import {eraseSpaces} from "../utils/erase-spaces";
import {Operation} from "../utils/operation";

/**
 * DiceCoefficient algorithm.
 * @see https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 */
export default class DiceCoefficient implements AlgorithmBase {

    constructor(private options: AlgorithmOptions = {ignoreSpaces: false, ignoreCase: true} as AlgorithmOptions) {}

    /**
     * Calculate differences between startText and endText strings and return the list of transformations.
     */
    public differences(startText: string, endText: string): Operation[] {
        throw new Error('This algorithm didn\'t have implementation for the differences method')
    }

    /**
     * Calculate the distance between startText and endText strings.
     */
    public distance(startText: string, endText: string): number {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        return this.diceCoefficientAlgorithm(startText, endText);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Dice-Coefficient algorithm
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
