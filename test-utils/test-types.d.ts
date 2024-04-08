declare interface OperationTest {
    type: any;
    value: string;
    previousValue?: string;
}

declare function applyOperations(start: string, end: string, operation: OperationTest[], ignoreCase: boolean): string;

declare function showResult(diffs: OperationTest[]): string;
