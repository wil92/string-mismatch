import {AlgorithmBase} from "./algorithm";
import {AlgorithmOptions} from "../utils/algorithm-options";
import {eraseSpaces} from "../utils/erase-spaces";
import {OperationType} from "../utils/operation-type";
import {compareChar} from "../utils/compare-char";
import {Operation} from "../utils/operation";

const MAX_VALUE = Number.MAX_VALUE;
const SUB = 0;
const DEL = 1;
const INS = 2;

/**
 * Levenshtein algorithm.
 * @see https://en.wikipedia.org/wiki/Levenshtein_distance
 */
export default class Levenshtein implements AlgorithmBase {

    dp: number[][] = [];

    constructor(private options: AlgorithmOptions = {ignoreCase: true, ignoreSpaces: false} as AlgorithmOptions) {
    }

    /**
     * Calculate differences between start string and end string and return the transformations list
     */
    differences(startText: string, endText: string): Operation[] {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        this.calculateMatrix(startText, endText);
        const subSolution = this.reconstructSolution(startText, endText);
        return this.joinSolution(subSolution);
    };

    /**
     * Calculate the string distance between start and end strings.
     * This method should be override in the new algorithm class
     */
    distance(startText: string, endText: string): number {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        this.calculateMatrix(startText, endText);
        return this.dp[0][0];
    }

    /**
     * Join values for the solution
     */
    joinSolution(subSolution: Operation[]): Operation[] {
        const result = [];
        if (subSolution && subSolution.length > 0) {
            let sub = {type: subSolution[0].type, value: subSolution[0].value};
            for (let i = 1; i < subSolution.length; i++) {
                if (subSolution[i].type !== sub.type || sub.type === OperationType.SUB_NAME) {
                    result.push(sub);
                    sub = {type: subSolution[i].type, value: ""} as Operation;
                }
                sub.value += subSolution[i].value;
            }
            result.push(sub);
        }
        return result;
    }

    /**
     * Return the transformation for transform the start string to the end string
     */
    reconstructSolution(startText: string, endText: string): Operation[] {
        const result = [];
        const sl = startText.length;
        const el = endText.length;
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
                    result.push({type: OperationType.EQL_NAME, value: startText[si]} as Operation);
                } else {
                    result.push({type: OperationType.SUB_NAME, value: startText[si] + endText[ei]} as Operation);
                }
            } else if (best[2] === DEL) {
                result.push({type: OperationType.DEL_NAME, value: startText[si]} as Operation);
            } else {
                result.push({type: OperationType.INS_NAME, value: endText[ei]} as Operation);
            }
            si = best[0];
            ei = best[1];
        }
        result.push({
            type: this.dp[si][ei] === 1 ? OperationType.SUB_NAME : OperationType.EQL_NAME,
            value: this.dp[si][ei] === 1 ? startText[si] + endText[ei] : startText[si]
        } as Operation);
        return result;
    };

    /**
     * Create and fill dp matrix before calculate Levenshtein distance algorithm
     */
    calculateMatrix(start: string, end: string): number[][] {
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
     */
    calculateLevenshtein(start: string, si: number, end: string, ei: number): number {
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
