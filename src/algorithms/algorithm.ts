import {Operation} from "../utils/operation";

export * from "../utils/algorithm-options";
export * from "../utils/operation";
export * from "../utils/operation-type";

export interface AlgorithmBase {
    /**
     * Calculate differences between start string and end string and return the transformations list
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns The list of operations to transform the start string into the end string.
     */
    differences(startText: string, endText: string): Operation[];

    /**
     * Calculate the distance between two strings.
     * @param startText The initial string.
     * @param endText The resulting string.
     * @returns The number of operations needed to transform the start string into the end string.
     */
    distance(startText: string, endText: string): number;
}
