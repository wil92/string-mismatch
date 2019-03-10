/**
 * Class for define the algorithms structure. All the algorithms should extend from this class.
 * @todo Modify this class to interface
 * @class AlgorithmBase
 */
export default class AlgorithmBase {
    /**
     * Calculate differences between start string and end string and return the transformations list.
     * This method should be override in the new algorithm class
     * @abstract
     */
    differences() {
        throw new Error("This method is not defined");
    }
}
