import {defaultFor} from "../utils/object";
import {eraseSpaces} from "../utils/string";
import AlgorithmBase from "./algorithm-base";

/**
 * DiceCoefficient algorithm.
 * @see https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 * @class DiceCoefficient
 */
export class DiceCoefficient extends AlgorithmBase {
    /**
     * DiceCoefficient algorithm constructor
     * @constructor
     * @param {{ignoreCase: boolean, ignoreSpaces: boolean}} options
     */
    constructor(options = undefined) {
        super();
        /** @ignore */
        this.options = Object.assign({ignoreCase: true, ignoreSpaces: false}, defaultFor(options, {}));
    };

    /**
     * Calculate differences between start string and end string and return the transformations list.
     * @param {string} start start string
     * @param {string} end end string
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformations
     * @abstract
     */
    differences(start, end) {
        super.differences(start, end);
    }

    /**
     * Calculate the string distance between start and end strings.
     * @override
     * @param {string} start start string
     * @param {string} end end string
     * @return {number} return string distance
     */
    distance(start, end) {
        if (defaultFor(this.options["ignoreSpaces"], false)) {
            start = eraseSpaces(start);
            end = eraseSpaces(end);
        }
        if (defaultFor(this.options["ignoreCase"], false)) {
            start = start.toLowerCase();
            end = end.toLowerCase();
        }
        return this.diceCoefficientAlgorithm(start, end);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Apply dice coefficient algorithm
     * @param {string} start start string
     * @param {string} end end string
     */
    diceCoefficientAlgorithm(start, end) {
        const startSet = new Set();
        const endSet = new Set();
        let intersection = 0;
        for (let i = 0; i < start.length - 1; i++) {
            startSet.add(start[i] + start[i + 1]);
        }
        for (let i = 0; i < end.length - 1; i++) {
            endSet.add(end[i] + end[i + 1]);
        }
        for (let pair of endSet) {
            intersection += startSet.has(pair) ? 1 : 0;
        }
        return 2 * intersection / (startSet.size + endSet.size);
    }
}

/**
 * Function by default for create the algorithm instance
 * @todo remove for version 2.0.0^
 * @ignore
 * @param {{ignoreCase: boolean, ignoreSpaces: boolean}} options
 * @return {DiceCoefficient}
 */
export default (options = undefined) => new DiceCoefficient(options);
