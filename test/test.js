'use strict';

var expect = require('chai').expect;
var sm = require('../string-mismatch');

describe('string-mismatch tests', function() {
    it('check how slice work in javascript language', function () {
        var array = [1, 2, 3 ,4];
        expect(array.length).to.equal(4);

        var arrayCopy = array.slice();
        expect(arrayCopy.length).to.equal(4);
    });

    it('check rotate library function', function(){
        var value = 'asd asd',
            expected = 'sd asda';
        expect(sm.rotate(value, 1)).to.equal(expected);
    });

    it('check rotate library function (undefine or empty value)', function(){
        var value = 'asd asd',
            expected = 'asd asd';
        expect(sm.rotate(value)).to.equal(expected);
    });

    it('check rotate library function (offset)', function(){
        var value = 'asd asd',
            expected = 'sd asda';
        expect(sm.rotate(value, 8)).to.equal(expected);
    });

    it('check rotate library function (negative)', function(){
        var value = 'asd asd',
            expected = 'dasd as';
        expect(sm.rotate(value, -1)).to.equal(expected);
    });

    it('check rotate library function (negative offset)', function(){
        var value = 'asd asd',
            expected = 'dasd as';
        expect(sm.rotate(value, -8)).to.equal(expected);
    });

    it('check getMatchingSubstring method for find matches', function(){
        var start = 'poasdf fdfsaf',
            end = 'bgasdfsdfs',
            mValue = 0;
        expect(sm.getMatchingSubstring(start, end, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it('check diff function with real values 1', function(){
        var start = 'This is a test for see how work the library',
            end = 'This is a test for know how work the new library',
            expected = [ { mtc: 'This is a test for ', del: 'see', ins: 'know', sbs: ' how work the ' }, { mtc: '', del: '', ins: 'new ', sbs: 'library' } ],
            precision = 5;
        expect(sm.diff(start, end, precision)).to.deep.equal(expected);
    });

});
