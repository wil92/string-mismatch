import chai from "chai";
import spy from "chai-spies";

import {StringMismatch} from "./string-mismatch";
import {Greedy} from "./algorithms/greedy";
import {Levenshtein} from "./algorithms/levenshtein";


chai.use(spy);
const expect = chai.expect;
const noop = function () {
};

describe("string-mismatch.js", () => {
    let greedy;
    let lev;
    let sm;

    before(function () {
        sm = new StringMismatch();
        greedy = new Greedy();
        lev = new Levenshtein();
    });

    describe("greedy tests", function () {
        before(function () {
            sm.use(greedy);
        });

        afterEach(function () {
            chai.spy.restore(lev);
        });

        it("should call differences() method", () => {
            chai.spy.on(greedy, "differences", noop);
            expect(sm.diff("start", "end"));
            expect(greedy.differences).to.have.been.called();
        });

        it("should call distance() method", () => {
            chai.spy.on(greedy, "distance", noop);
            expect(sm.dist("start", "end"));
            expect(greedy.distance).to.have.been.called();
        });
    });

    describe("levenshtein tests", function () {
        before(function () {
            sm.use(lev);
        });

        afterEach(function () {
            chai.spy.restore(lev);
        });

        it("should call the differences() method", () => {
            chai.spy.on(lev, "differences", noop);
            expect(sm.diff("start", "end"));
            expect(lev.differences).to.have.been.called();
        });

        it("should call the distance() method", function () {
            chai.spy.on(lev, "distance", noop);
            expect(sm.dist("start", "end"));
            expect(lev.distance).to.have.been.called();
        });
    });

    describe("levenshtein integration tests", function () {
        before(function () {
            sm.use(lev);
        });

        it("should check defferences with real data", function () {
            const start = "my",
                end = "you";
            expect(lev.differences(start, end)).to.deep.equal([
                {type: "sub", value: "my"},
                {type: "ins", value: "o"},
                {type: "sub", value: "yu"}
            ]);
        });

        it("should check differences with real data (bug in production)", function () {
            const start = "my name is juan",
                end = "mi nombre es juan";
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([
                {type: "eql", value: "m"}, {type: "sub", value: "yi"}, {type: "eql", value: " n"},
                {type: "sub", value: "ao"}, {type: "eql", value: "m"}, {type: "ins", value: "br"},
                {type: "eql", value: "e "}, {type: "sub", value: "ie"}, {type: "eql", value: "s juan"}
            ]);
        });

        it("should check differences between two strings of one character", function () {
            const start = "m",
                end = "n";
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([{type: "sub", value: "mn"}]);
        });

        it("should check differences between two  equal strings ignoring the spaces", function () {
            const start = "  m   ",
                end = "m";
            lev.options["ignoreSpaces"] = true;
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([{type: "eql", value: "m"}]);
        });

        it("should not find any difference between two string of one character", function () {
            const start = "m",
                end = "m";
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([{type: "eql", value: "m"}]);
        });

        it("should not find any difference between two string if ignoreCase is true", function () {
            const start = "M",
                end = "m";
            lev.options.ignoreCase = true;
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([{type: "eql", value: "M"}]);
        });

        it("should find a mismatch with ignoreCase in false", function () {
            const start = "M",
                end = "m";
            lev.options.ignoreCase = false;
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, end)).to.deep.equal([{type: "sub", value: "Mm"}]);
        });

        it("should not find any difference between two string of one character", function () {
            const start = "my name is john";
            // noinspection JSUnresolvedVariable
            expect(lev.differences(start, start)).to.deep.equal([{type: "eql", value: "my name is john"}]);
        });
    });
});
