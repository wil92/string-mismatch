import {eraseSpaces} from "./erase-spaces";
import {compareChar} from "./compare-char";

describe('utils', () => {
    describe('erase-spaces.ts', () => {
        it('Validate spaces removed', () => {
            expect(eraseSpaces("  a   a  ")).toEqual("a a");
            expect(eraseSpaces("a   a")).toEqual("a a");
            expect(eraseSpaces("a a")).toEqual("a a");
        });
    });

    describe('compare-char.ts', () => {
        it('Validate characters comparison', () => {
            expect(compareChar("a", "a", false)).toEqual(true);
            expect(compareChar("a", "b", false)).toEqual(false);
            expect(compareChar("a", "A", false)).toEqual(false);
            expect(compareChar("a", "A", true)).toEqual(true);
        });
    });
});