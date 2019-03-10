import {defaultFor} from "../utils/object";
import {compareChar, eraseSpaces} from "../utils/string";
import vars from "../utils/vars";
import AlgorithmBase from "./algorithm-base";

/**
 * Greedy algorithm
 * @class Greedy
 */
export class Greedy extends AlgorithmBase {
    /**
     * Greedy algorithm constructor
     * @param {{precision: number, ignoreCase: boolean, ignoreSpaces: boolean}} options
     */
    constructor(options = undefined) {
        super();
        /** @ignore */
        this.options = Object.assign({
            precision: 5,
            ignoreCase: true,
            ignoreSpaces: false
        }, defaultFor(options, {}));
    };

    /**
     * Calculate differences between start string and end string and return the transformations list
     * @param {string} start start string
     * @param {string} end end string
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformations
     */
    differences(start, end) {
        if (defaultFor(this.options["ignoreSpaces"], false)) {
            start = eraseSpaces(start);
            end = eraseSpaces(end);
        }
        return this.diff(start, end);
    };

    /**
     * Return the list of changes in the original text
     * @param {string} start start text
     * @param {string} end end text
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
     *      mtc: start part of the section
     *      del: erase part of the section
     *      ins: new part of the section
     *      sbs: last part of the section
     */
    diff(start, end) {
        const changeData = this.getChanges(start, end, "");
        const nextS = end.slice(changeData.mtc.length + changeData.ins.length + changeData.sbs.length);
        const nextThis = start.slice(changeData.mtc.length + changeData.del.length + changeData.sbs.length);
        let result = [];
        changeData.mtc && result.push({type: vars.EQL_NAME, value: changeData.mtc});
        changeData.del && result.push({type: vars.DEL_NAME, value: changeData.del});
        changeData.ins && result.push({type: vars.INS_NAME, value: changeData.ins});
        changeData.sbs && result.push({type: vars.EQL_NAME, value: changeData.sbs});

        if (nextThis !== "" || nextS !== "") {
            result = result.concat(this.diff(nextThis, nextS));
        }
        return result;
    };

    /**
     * Recursively find the possibles solutions for the differences between start and end texts
     * @param {string} start start text
     * @param {string} end end text
     * @param {string} unchangedStr parameter no needed (is only for inside use)
     * @returns {{fis: number, fil: number, sbs: string, mtc: string}}
     */
    getChanges(start, end, unchangedStr) {
        const ignoreCase = defaultFor(this.options.ignoreCase, false);
        const precision = defaultFor(this.options.precision, 5);
        const isThisLonger = start.length >= end.length;
        let bi = 0;
        let longer = isThisLonger ? start : end;
        let shorter = isThisLonger ? end : start;

        while (compareChar(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi;
        longer = longer.slice(bi);
        shorter = shorter.slice(bi);

        const len = longer.length;
        let sub = {sbs: ""};
        let cd = {
            fis: shorter.length,
            fil: len,
            sbs: "",
            mtc: unchangedStr + end.slice(0, bi)
        };

        if (shorter !== "") {
            for (let rc = 0; rc < len && sub.sbs.length < precision; rc++) {
                sub = this.getMatchingSubstring(shorter, longer, rc, cd.mtc);
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
     * @param {string} source begin text
     * @param {string} changed end text
     * @param {number} rotation rotation value in the changed string
     * @param {string} unchangedStr Not changed sub-string value
     * @returns {{fis: number, mtc: string, sbs: string}}
     */
    getMatchingSubstring(source, changed, rotation, unchangedStr) {
        const ignoreCase = defaultFor(this.options.ignoreCase, false);
        const sourceLength = source.length;
        const changedLength = changed.length;
        const subResult = {fis: sourceLength, mtc: unchangedStr, sbs: ""};
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

export default Greedy;
