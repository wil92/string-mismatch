/** @ignore */
import obj from "./utils/object";
import Greedy from "./algorithms/greedy";

/**
 * core class of the library
 * @class sm
 */
class sm {

    /**
     * string-mismatch constructor
     * @param algorithm algorithm to use, greedy algorithm is by default
     */
    constructor(algorithm = null) {
        if (obj.isNil(algorithm)) {
            this.checkAlgorithm();
        }
    }

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
        obj.isNil(this.algorithm) && this.use();
    };

    /**
     * Change the algorithm for calculate string differences or use greedy algorithm by default
     * @access public
     * @param algorithm Algorithm instance to use
     */
    use (algorithm = null) {
        this.algorithm = algorithm || new Greedy();
    };
}

export default sm;
