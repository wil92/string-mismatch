import {defaultFor} from "../utils/object";
import {eraseSpaces, compareChar} from "../utils/string";
import vars from "../utils/vars";
import AlgorithmBase from "./algorithm-base";

/** @ignore */
const MAX_VALUE = 9999999999;
/** @desc Substitution action */
const SUB = 0;
/** @desc Delete action */
const DEL = 1;
/** @desc Insertion action */
const INS = 2;

/**
 * Levenshtein algorithm.
 * @see https://en.wikipedia.org/wiki/Levenshtein_distance
 * @class Levenshtein
 */
export class Levenshtein extends AlgorithmBase {
    /**
     * Levenshtein algorithm constructor
     * @constructor
     * @param {{ignoreCase: boolean, ignoreSpaces: boolean}} options
     */
    constructor(options = undefined) {
        super();
        /** @ignore */
        this.options = Object.assign({ignoreCase: true, ignoreSpaces: false}, defaultFor(options, {}));
    };

    /**
     * Calculate differences between start string and end string and return the transformations list
     * @param {string} start start string
     * @param {string} end end string
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformation
     */
    differences(start, end) {
        if (defaultFor(this.options["ignoreSpaces"], false)) {
            start = eraseSpaces(start);
            end = eraseSpaces(end);
        }
        this.calculateMatrix(start, end);
        const result = [];
        const subResult = this.reconstructSolution(start, end);
        if (subResult.length > 0) {
            let sub = {type: subResult[0].type, value: subResult[0].value};
            for (let i = 1; i < subResult.length; i++) {
                if (subResult[i].type !== sub.type || sub.type === vars.SUB_NAME) {
                    result.push(sub);
                    sub = {type: subResult[i].type, value: ""};
                }
                sub.value += subResult[i].value;
            }
            result.push(sub);
        }
        return result;
    };

    /**
     * Calculate the string distance between start and end strings.
     * This method should be override in the new algorithm class
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
        this.calculateMatrix(start, end);
        return this.dp[0][0];
    }

    /**
     * Return the transformation for transform the start string to the end string
     * @param {string} start start string
     * @param {string} end end string
     * @return {{type: string, value: string}[]} the reconstructed solution
     */
    reconstructSolution(start, end) {
        const result = [];
        const sl = start.length;
        const el = end.length;
        let si = 0;
        let ei = 0;
        while (si !== sl - 1 || ei !== el - 1) {
            const options = [];
            si + 1 < sl && options.push([si + 1, ei, DEL]);
            ei + 1 < el && options.push([si, ei + 1, INS]);
            si + 1 < sl && ei + 1 < el && options.push([si + 1, ei + 1, SUB]);
            const best = options.sort((o, p) => {
                if (this.dp[o[0]][o[1]] === this.dp[p[0]][p[1]]) {
                    return o[2] - p[2];
                }
                return this.dp[o[0]][o[1]] - this.dp[p[0]][p[1]];
            })[0];
            if (best[2] === SUB) {
                if (this.dp[si][ei] === this.dp[best[0]][best[1]]) {
                    result.push({type: vars.EQL_NAME, value: start[si]});
                } else {
                    result.push({type: vars.SUB_NAME, value: start[si] + end[ei]});
                }
            } else if (best[2] === DEL) {
                result.push({type: vars.DEL_NAME, value: start[si]});
            } else {
                result.push({type: vars.INS_NAME, value: end[ei]});
            }
            si = best[0];
            ei = best[1];
        }
        result.push({
            type: this.dp[si][ei] === 1 ? vars.SUB_NAME : vars.EQL_NAME,
            value: this.dp[si][ei] === 1 ? start[si] + end[ei] : start[si]
        });
        return result;
    };

    /**
     * Create and fill dp matrix before calculate Levenshtein distance algorithm
     * @param {string} start start string
     * @param {string} end end string
     * @return {Array} resulting dp matrix
     */
    calculateMatrix(start, end) {
        /** @ignore */
        this.dp = [];
        for (let i = 0; i < start.length; i++) {
            const array = [];
            for (let j = 0; j < end.length; j++) {
                array.push(-1);
            }
            this.dp.push(array);
        }
        this.calculateLevenshtein(start, 0, end, 0);
        return this.dp;
    };

    /**
     * Calculate Levenshtein distance with a brute force approach with dynamic programing improvement
     * @param {string} start start string
     * @param {number} si start position in the recursion
     * @param {string} end end string
     * @param {number} ei end position in the recursion
     * @return {number} Levenshtein distance between start and end strings
     */
    calculateLevenshtein(start, si, end, ei) {
        if (si === start.length && ei === end.length) {
            return 0;
        }
        if (si === start.length || ei === end.length) {
            return MAX_VALUE;
        }
        if (this.dp[si][ei] !== -1) {
            return this.dp[si][ei];
        }
        return this.dp[si][ei] = Math.min(
            this.calculateLevenshtein(start, si + 1, end, ei) + 1,
            this.calculateLevenshtein(start, si, end, ei + 1) + 1,
            this.calculateLevenshtein(start, si + 1, end, ei + 1) + (compareChar(start[si], end[ei], this.options.ignoreCase) ? 0 : 1)
        );
    }
}

/**
 * Function by default for create the algorithm instance
 * @todo remove for version 2.0.0^
 * @ignore
 * @param {{ignoreCase: boolean, ignoreSpaces: boolean}} options
 * @return {Levenshtein}
 */
export default (options = undefined) => new Levenshtein(options);
