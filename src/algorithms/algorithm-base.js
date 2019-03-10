/**
 * Class for define the algorithms structure. All the algorithms should extend from this class.
 * @todo Modify this class to interface
 * @class AlgorithmBase
 */
export default class AlgorithmBase {
    /**
     * Calculate differences between start string and end string and return the transformations list.
     * This method should be override in the new algorithm class
     * @param {string} start start string
     * @param {string} end end string
     * @return {{mtc: string, del: string, ins: string, sbs: string}[]} List of transformations
     * @abstract
     */
    differences(start, end) {
        throw new Error("This method is not defined");
    }
}
