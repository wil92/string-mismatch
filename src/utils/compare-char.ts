export function compareChar(character1: string, character2: string, ignoreCase: boolean): boolean {
    if (ignoreCase) {
        return character1.toLowerCase() === character2.toLowerCase();
    }
    return character1 === character2;
}
