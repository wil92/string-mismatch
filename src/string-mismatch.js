/** @ignore */
import {isNil} from "./utils/object";
import Greedy from "./algorithms/greedy";

/**
 * @class sm
 */
export class sm {
    /**
     * Change the algorithm for calculate string differences or use greedy algorithm by default
     * @access public
     * @param algorithm Algorithm instance to use
     */
    use (algorithm) {
        this.algorithm = algorithm || Greedy();
    };

    /**
     * return the list of changes in the original text
     * @access public
     * @param start {string} start text
     * @param end {string} end text
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]}
     *      mtc: start part of the section
     *      del: erase part of the section
     *      ins: new part of the section
     *      sbs: last part of the section
     */
    diff(start, end) {
        this.checkAlgorithm();
        return this.algorithm.differences(start, end);
    };

    /**
     * Check if there is some algorithm instance in the library and use greedy algorithm by default otherwise
     * @access private
     */
    checkAlgorithm() {
        isNil(this.algorithm) && this.use();
    };
}
