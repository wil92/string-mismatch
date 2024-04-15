import {AlgorithmBase} from "./algorithm";
import {AlgorithmOptions} from "../utils/algorithm-options";
import {eraseSpaces} from "../utils/erase-spaces";
import {OperationType} from "../utils/operation-type";
import {compareChar} from "../utils/compare-char";
import {Operation} from "../utils/operation";

export interface GreedyAlgorithmOptions extends AlgorithmOptions {
    /**
     * The precision of the algorithm.
     * This value is used to limit the number of rotations to find the matching substring.
     * If this value is too high the algorithm will be n^2.
     * @default 5
     */
    precision?: number;
}

interface SubOperations {
    fis: number;
    fil: number;
    sbs: string
    mtc: string;
    del: string;
    ins: string;
}

/**
 * Greedy algorithm
 */
export class Greedy implements AlgorithmBase {

    constructor(public options: GreedyAlgorithmOptions = {
        ignoreSpaces: false,
        ignoreCase: true,
        precision: 5
    } as GreedyAlgorithmOptions) {
    }

    /**
     * Calculate the distance between two strings.
     * @param start The initial string.
     * @param end The resulting string.
     * @returns The number of operations needed to transform the start string into the end string.
     */
    public distance(start: string, end: string): number {
        if (this.options.ignoreSpaces) {
            start = eraseSpaces(start);
            end = eraseSpaces(end);
        }
        const diffs = this.differences(start, end);
        let result = 0;
        for (let i = 0; i < diffs.length; i++) {
            result += diffs[i] && diffs[i].type === OperationType.DEL_NAME && diffs[i].value.length || 0;
            result += diffs[i] && diffs[i].type === OperationType.INS_NAME && diffs[i].value.length || 0;
        }
        return result;
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

        const changeData = this.getChanges(startText, endText, "");
        const nextS = endText.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length);
        const nextThis = startText.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length);
        let result: Operation[] = [];
        changeData.mtc && result.push({type: OperationType.EQL_NAME, value: changeData.mtc});
        changeData.del && result.push({type: OperationType.DEL_NAME, value: changeData.del});
        changeData.ins && result.push({type: OperationType.INS_NAME, value: changeData.ins});
        changeData.sbs && result.push({type: OperationType.EQL_NAME, value: changeData.sbs});

        if (nextThis !== "" || nextS !== "") {
            result = [...result, ...this.differences(nextThis, nextS)];
        }
        return result;
    };

    /**
     * Recursively find the possibles solutions for the differences between start and end texts
     * @param start The initial string.
     * @param end The resulting string.
     * @param unchangedStr The string that is unchanged between the two strings.
     * @returns The list of operations to transform the start string into the end string.
     */
    private getChanges(start: string, end: string, unchangedStr: string): SubOperations {
        const ignoreCase = Boolean(this.options.ignoreCase);
        const precision = this.options.precision || 5;
        const isThisLonger = start.length >= end.length;
        let bi = 0;
        let longer = isThisLonger ? start : end;
        let shorter = isThisLonger ? end : start;

        while (bi < shorter.length && compareChar(shorter[bi], longer[bi], ignoreCase)) ++bi;
        longer = longer.slice(bi);
        shorter = shorter.slice(bi);

        const len = longer.length;
        let sub = {sbs: ""} as SubOperations;
        let cd = {
            fis: shorter.length,
            fil: len,
            sbs: "",
            mtc: unchangedStr + end.slice(0, bi)
        } as SubOperations;

        if (shorter !== "") {
            for (let rotationCount = 0; rotationCount < len && sub.sbs.length < precision; rotationCount++) {
                sub = this.getMatchingSubstring(shorter, longer, rotationCount);
                if (sub.sbs.length > cd.sbs.length) {
                    sub.mtc = cd.mtc;
                    sub.fil = rotationCount < len - sub.fis ? sub.fis + rotationCount : sub.fis - len + rotationCount;
                    cd = sub;
                }
            }
        }
        cd.del = isThisLonger ? longer.slice(0, cd.fil) : shorter.slice(0, cd.fis);
        cd.ins = isThisLonger ? shorter.slice(0, cd.fis) : longer.slice(0, cd.fil);

        if (cd.del.indexOf(" ") === -1 || cd.ins.indexOf(" ") === -1 || cd.del === "" || cd.ins === "" || cd.sbs === "") {
            return cd;
        } else {
            return this.getChanges(cd.del, cd.ins, cd.mtc);
        }
    };

    /**
     * Find the first matching substring between two strings
     * @param shorter The initial string.
     * @param longer The resulting string.
     * @param rotation The rotation value.
     * @returns The first matching substring between the two strings.
     */
    private getMatchingSubstring(shorter: string, longer: string, rotation: number): SubOperations {
        const ignoreCase = Boolean(this.options.ignoreCase);
        const shorterLength = shorter.length;
        const longerLength = longer.length;
        const subResult = {fis: shorterLength, sbs: ""} as SubOperations;
        let index = 0;
        let matchOnce = false;
        while (index < shorterLength && (index + rotation) < longerLength) {
            const indexRot = index + rotation;
            if (compareChar(longer[indexRot], shorter[index], ignoreCase)) {
                if (matchOnce) {
                    subResult.sbs += shorter[index];
                } else {
                    matchOnce = true;
                    subResult.fis = index;
                    subResult.sbs = shorter[index];
                }
            } else if (matchOnce) {
                break;
            }
            ++index;
        }
        return subResult;
    };
}

export default Greedy;
