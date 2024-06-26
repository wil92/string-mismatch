import {AlgorithmBase} from "./algorithm";
import {AlgorithmOptions} from "../utils/algorithm-options";
import {eraseSpaces} from "../utils/erase-spaces";
import {OperationType} from "../utils/operation-type";
import {compareChar} from "../utils/compare-char";
import {Operation} from "../utils/operation";

export interface LevenshteinOptions extends AlgorithmOptions {
    /**
     * Enable or disable the substitution operation.
     * @default true
     */
    enableSubstitution: boolean;
}

interface Position {
    i: number;
    j: number;
}

/**
 * Levenshtein algorithm.
 * The Levenshtein algorithm is a method for finding the minimum number of operations needed to transform a string into another string.
 * The allowed operations are insertion, deletion, and substitution.
 * @see https://en.wikipedia.org/wiki/Levenshtein_distance
 */
export class Levenshtein implements AlgorithmBase {
    constructor(public options: LevenshteinOptions = {
        ignoreCase: true,
        ignoreSpaces: false,
        enableSubstitution: true
    } as LevenshteinOptions) {
    }

    /**
     * Calculate differences between start string and end string and return the transformations list
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns The list of operations to transform the start string into the end string.
     */
    public differences(startText: string, endText: string): Operation[] {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        const {path} = this.calculateMatrix(startText, endText, true);
        const solution: Operation[] = [];

        const q = [{i: startText.length, j: endText.length}];
        while (q.length > 0) {
            const p = q.shift();
            if (!p || p.i === 0 && p.j === 0) {
                break;
            }
            const move = path && {...path[p.i][p.j]} || {i: 0, j: 0} as Position;
            move.i = move.i - p.i;
            move.j = move.j - p.j;

            if (move.i !== 0 && move.j !== 0) {
                solution.push({
                    type: compareChar(startText[p.i - 1], endText[p.j - 1], this.options.ignoreCase) ? OperationType.EQL_NAME : OperationType.SUB_NAME,
                    value: endText[p.j - 1],
                    previousValue: startText[p.i - 1]
                } as Operation);
            } else if (move.i !== 0) {
                solution.push({type: OperationType.DEL_NAME, value: startText[p.i - 1]} as Operation);
            } else {
                solution.push({type: OperationType.INS_NAME, value: endText[p.j - 1]} as Operation);
            }
            q.push({i: move.i + p.i, j: move.j + p.j});
        }

        return this.compactSolution(solution.reverse());
    };

    /**
     * Utilize the Levenshtein algorithm to compute the distance between the start and end strings.
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns The Levenshtein distance between the two strings.
     */
    public distance(startText: string, endText: string): number {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }
        const dp: number[][] = this.calculateMatrix(startText, endText).dp;
        return dp[startText.length][endText.length];
    }

    /**
     * Compact the solution to merge the operations that can be done in a single step.
     * @param subSolution The list of operations to compact.
     * @returns The compacted list of operations.
     */
    private compactSolution(subSolution: Operation[]): Operation[] {
        const result: Operation[] = [];
        if (subSolution && subSolution.length > 0) {
            let sub = {...subSolution[0]};
            for (let i = 1; i < subSolution.length; i++) {
                if (subSolution[i].type !== sub.type) {
                    this.insertSubOperation(result, sub);
                    sub = {...subSolution[i], value: ''} as Operation;
                    if (subSolution[i].type === OperationType.SUB_NAME || subSolution[i].type === OperationType.EQL_NAME) {
                        sub.previousValue = '';
                    }
                }
                sub.value += subSolution[i].value;
                if (subSolution[i].previousValue !== undefined && sub.previousValue !== undefined) {
                    sub.previousValue += subSolution[i].previousValue;
                }
            }
            this.insertSubOperation(result, sub);
        }
        return result;
    }

    private insertSubOperation(result: Operation[], sub: Operation): void {
        if (this.options.enableSubstitution || sub.type != OperationType.SUB_NAME) {
            result.push(sub);
        } else {
            result.push({
                type: OperationType.DEL_NAME,
                value: sub.previousValue,
                previousValue: undefined
            } as Operation);
            result.push({type: OperationType.INS_NAME, value: sub.value, previousValue: undefined} as Operation);
        }
    }

    /**
     * Calculate the matrix with the Levenshtein distance between the start and end strings.
     * @param start The initial string.
     * @param end The resulting string.
     * @param calculatePath Whether to calculate the path or not.
     * @returns The matrix with the distances and the path.
     */
    private calculateMatrix(start: string, end: string, calculatePath: boolean = false): {
        dp: number[][],
        path?: Position[][]
    } {
        const dp: number[][] = [];
        const path: Position[][] | undefined = calculatePath ? [] : undefined;
        for (let i: number = 0; i < start.length + 1; i++) {
            dp.push(new Array(end.length + 1).fill(0));
            if (path) {
                path.push(new Array(end.length + 1).fill({i: 0, j: 0} as Position));
            }
        }
        this.calculateLevenshtein(start, end, dp, path);
        return {dp, path};
    };

    /**
     * Calculate the Levenshtein distance between the start and end strings.
     * @param start The initial string.
     * @param end The resulting string.
     * @param dp The matrix to store the distances.
     * @param path The matrix to store the path.
     */
    private calculateLevenshtein(start: string, end: string, dp: number[][], path: Position[][] | undefined = undefined): void {
        for (let i = 0; i <= start.length; i++) {
            dp[i][0] = i;
            if (path && i > 0) {
                path[i][0] = {i: i - 1, j: 0} as Position;
            }
        }
        for (let i = 0; i <= end.length; i++) {
            dp[0][i] = i;
            if (path && i > 0) {
                path[0][i] = {i: 0, j: i - 1} as Position;
            }
        }
        for (let i = 1; i <= start.length; i++) {
            for (let j = 1; j <= end.length; j++) {
                const best = [
                    {v: dp[i - 1][j] + 1, i: i - 1, j},
                    {v: dp[i][j - 1] + 1, i, j: j - 1},
                    {
                        v: dp[i - 1][j - 1] + (compareChar(start[i - 1], end[j - 1], this.options.ignoreCase) ? 0 : this.options.enableSubstitution ? 1 : 2),
                        i: i - 1,
                        j: j - 1
                    }]
                    .sort((a: any, b: any) => a.v - b.v)[0];
                dp[i][j] = best.v;
                if (path) {
                    path[i][j] = best;
                }
            }
        }
    }
}

export default Levenshtein;
