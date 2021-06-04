import {Operation} from "../utils/operation";

export interface AlgorithmBase {
    differences(startText: string, endText: string): Operation[];
    distance(startText: string, endText: string): number;
}
