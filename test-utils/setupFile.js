function compareChar(char1, char2, ignoreCase) {
    if (ignoreCase) {
        return char1.toLowerCase() === char2.toLowerCase();
    }
    return char1 === char2;
}

global.applyOperations = function(start, end, operations, ignoreCase) {
    let result = '';
    let startIt = 0;
    let endIt = 0;
    for (let op of operations) {
        switch (op.type) {
            case "eql":
                expect(compareChar(start.substring(startIt, startIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
            case "del":
                expect(compareChar(start.substring(startIt, startIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                startIt += op.value.length;
                break;
            case "ins":
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                endIt += op.value.length;
                break;
            case "sub":
                expect(compareChar(start.substring(startIt, startIt + (op.previousValue || '').length), op.previousValue || '', ignoreCase)).toBeTruthy();
                expect(compareChar(end.substring(endIt, endIt + op.value.length), op.value, ignoreCase)).toBeTruthy();
                result += op.value;
                startIt += op.value.length;
                endIt += op.value.length;
                break;
        }
    }
    return result;
};

global.showResult = function(diffs) {
    return diffs.reduce((text, value) => {
        switch (value.type) {
            case "del":
                return `${text}(-${value.value})`;
            case "ins":
                return `${text}(+${value.value})`;
            case "sub":
                return `${text}(-${value.previousValue}+${value.value})`;
            case "eql":
                return text + value.value;
        }
        return '';
    }, "");
}
