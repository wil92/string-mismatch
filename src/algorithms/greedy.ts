import {AlgorithmBase} from "./algorithm";
import {AlgorithmOptions} from "../utils/algorithm-options";
import {eraseSpaces} from "../utils/erase-spaces";
import {OperationType} from "../utils/operation-type";
import {compareChar} from "../utils/compare-char";
import {Operation} from "../utils/operation";

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

    constructor(private options: AlgorithmOptions = {
        ignoreSpaces: false,
        ignoreCase: true,
        precision: 5
    } as AlgorithmOptions) {
    }

    /**
     * Calculate the string distance between start and end strings.
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
     */
    public differences(startText: string, endText: string): Operation[] {
        if (this.options.ignoreSpaces) {
            startText = eraseSpaces(startText);
            endText = eraseSpaces(endText);
        }

        const changeData = this.getChanges(startText, endText, "");
        const nextS = endText.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length);
        const nextThis = startText.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length);
        let result = [];
        changeData.mtc && result.push({type: OperationType.EQL_NAME, value: changeData.mtc});
        changeData.del && result.push({type: OperationType.DEL_NAME, value: changeData.del});
        changeData.ins && result.push({type: OperationType.INS_NAME, value: changeData.ins});
        changeData.sbs && result.push({type: OperationType.EQL_NAME, value: changeData.sbs});

        if (nextThis !== "" || nextS !== "") {
            result = result.concat(this.differences(nextThis, nextS));
        }
        return result;
    };

    /**
     * Recursively find the possibles solutions for the differences between start and end texts
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
            for (let rc = 0; rc < len && sub.sbs.length < precision; rc++) {
                const sub = this.getMatchingSubstring(shorter, longer, rc, cd.mtc);
                sub.fil = rc < len - sub.fis ? sub.fis + rc
                    : sub.fis - len + rc;
                sub.sbs.length > cd.sbs.length && (cd = sub);
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
     * Returns the first matching substring in-between the two strings
     */
    getMatchingSubstring(source: string, changed: string, rotation: number, unchangedStr: string): SubOperations {
        const ignoreCase = Boolean(this.options.ignoreCase);
        const sourceLength = source.length;
        const changedLength = changed.length;
        const subResult = {fis: sourceLength, mtc: unchangedStr, sbs: ""} as SubOperations;
        let index = 0;
        let match = false;
        while (index < sourceLength) {
            const indexRot = (index + (rotation < 0 ? changedLength - Math.abs(rotation) % changedLength : rotation)) % changedLength;
            if (compareChar(changed[indexRot], source[index], ignoreCase)) {
                if (match) {
                    subResult.sbs += source[index];
                } else {
                    match = true;
                    subResult.fis = index;
                    subResult.sbs = source[index];
                }
            } else if (match) {
                break;
            }
            ++index;
        }
        return subResult;
    };
}
