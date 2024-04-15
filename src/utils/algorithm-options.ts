/**
 * Base algorithm options.
 */
export interface AlgorithmOptions {
    /**
     * If true, the algorithm will ignore the case of the characters.
     * If false, the algorithm will consider the case of the characters.
     * @default true
     */
    ignoreCase: boolean;
    /**
     * Ignore or consider extra spaces.
     * If true, the algorithm will ignore the spaces.
     * If false, the algorithm will consider the spaces.
     * @default false
     */
    ignoreSpaces: boolean;
}
