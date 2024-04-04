import {OperationType} from "./operation-type";

export interface Operation {
    type: OperationType;
    value: string;
    previousValue?: string;
}
