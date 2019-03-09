import chai from "chai";

import string from "./string";

const expect = chai.expect;

describe("utils.js", function () {
    it("should remove the spaces (example with only one word between spaces)", function () {
        expect(string.eraseSpaces(" test  ")).to.equal("test");
    });

    it("should remove the spaces (example with spaces between words)", function () {
        expect(string.eraseSpaces("test  remove      spaces")).to.equal("test remove spaces");
    });

    it("should remove the spaces (example with spaces between words and in the corners)", function () {
        expect(string.eraseSpaces("    test  remove      spaces    ")).to.equal("test remove spaces");
    });
});
