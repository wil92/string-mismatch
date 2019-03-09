import obj from "../utils/object";
import str from "../utils/string";
import vars from "../utils/vars";

/**
 * Greedy algorithm
 * @class Greedy
 */
class Greedy {
    /**
     * Greedy algorithm constructor
     * @param options {{precision: number, ignoreCase: boolean, ignoreSpaces: boolean}}
     */
    constructor(options = undefined) {
        this.options = Object.assign({
            precision: 5,
            ignoreCase: true,
            ignoreSpaces: false
        }, obj.defaultFor(options, {}));
    };

    /**
     * Calculate differences between start string and end string and return the transformations list
     * @param start {string} start string
     * @param end {string} end string
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformations
     */
    differences(start, end) {
        if (obj.defaultFor(this.options["ignoreSpaces"], false)) {
            start = str.eraseSpaces(start);
            end = str.eraseSpaces(end);
        }
        return this.diff(start, end);
    };

    /**
     * Return the list of changes in the original text
     * @param start {string} start text
     * @param end {string} end text
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
     * @param start {string} start text
     * @param end {string} end text
     * @param unchangedStr {string} parameter no needed (is only for inside use)
     * @returns {{fis: number, fil: number, sbs: string, mtc: string}}
     */
    getChanges(start, end, unchangedStr) {
        const ignoreCase = obj.defaultFor(this.options.ignoreCase, false);
        const precision = obj.defaultFor(this.options.precision, 5);
        const isThisLonger = start.length >= end.length;
        let bi = 0;
        let longer = isThisLonger ? start : end;
        let shorter = isThisLonger ? end : start;

        while (str.compareChar(shorter[bi], longer[bi], ignoreCase) && bi < shorter.length) ++bi;
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
     * @param source {string} begin text
     * @param changed {string} end text
     * @param rotation {number} rotation value in the changed string
     * @param unchangedStr {string} Not changed sub-string value
     * @returns {{fis: number, mtc: string, sbs: string}}
     */
    getMatchingSubstring(source, changed, rotation, unchangedStr) {
        const ignoreCase = obj.defaultFor(this.options.ignoreCase, false);
        const sourceLength = source.length;
        const changedLength = changed.length;
        const subResult = {fis: sourceLength, mtc: unchangedStr, sbs: ""};
        let index = 0;
        let match = false;
        while (index < sourceLength) {
            const indexRot = (index + (rotation < 0 ? changedLength - Math.abs(rotation) % changedLength : rotation)) % changedLength;
            if (str.compareChar(changed[indexRot], source[index], ignoreCase)) {
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
