/** @ignore */
import {isNil} from "./utils/object";
import {Greedy} from "./algorithms/greedy";

/**
 * core class of the library
 * @class sm
 */
export class StringMismatch {

    /**
     * string-mismatch constructor
     * @param {AlgorithmBase} algorithm algorithm to use, greedy algorithm is by default
     */
    constructor(algorithm = null) {
        if (isNil(algorithm)) {
            this.checkAlgorithm();
        }
    }

    /**
     * return the list of changes in the original text
     * @access public
     * @param {string} start start text
     * @param {string} end end text
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
     * return the distance from the start string to the end string with the operation available for the current algorithm.
     * @access public
     * @param {string} start start text
     * @param {string} end end text
     * @return {number} string distance
     */
    dist(start, end) {
        return this.algorithm.distance(start, end);
    }

    /**
     * Check if there is some algorithm instance in the library and use greedy algorithm by default otherwise
     * @access private
     */
    checkAlgorithm() {
        isNil(this.algorithm) && this.use();
    };

    /**
     * Change the algorithm for calculate the string differences or use greedy algorithm by default
     * @access public
     * @param {AlgorithmBase} algorithm Algorithm instance to use
     */
    use(algorithm = null) {
        /** @ignore */
        this.algorithm = algorithm || new Greedy();
    };
}

/**
 * @ignore
 * @type {StringMismatch}
 */
const sm = new StringMismatch();
/** @ignore */
export default sm;
