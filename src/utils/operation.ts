import {OperationType} from "./operation-type";

/**
 * Operation interface.
 */
export interface Operation {
    /**
     * Operation type.
     */
    type: OperationType;
    /**
     * Operation value.
     * The value is the character that is inserted, deleted, substituted or not changed.
     */
    value: string;
    /**
     * The previous value.
     * The previous value is the character that is substituted.
     */
    previousValue?: string;
}
