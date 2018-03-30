'use strict';

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
var expect = require('chai').expect;
// noinspection JSUnresolvedFunction
var sm = require('../string-mismatch');

describe('string-mismatch tests', function() {
    it('check how slice work in javascript language', function () {
        var array = [1, 2, 3 ,4];
        // noinspection JSUnresolvedVariable
        expect(array.length).to.equal(4);

        var arrayCopy = array.slice();
        // noinspection JSUnresolvedVariable
        expect(arrayCopy.length).to.equal(4);
    });

    it('check rotate library function', function(){
        var value = 'asd asd',
            expected = 'sd asda';
        // noinspection JSUnresolvedVariable
        expect(sm.rotate(value, 1)).to.equal(expected);
    });

    it('check rotate library function (undefine or empty value)', function(){
        var value = 'asd asd',
            expected = 'asd asd';
        // noinspection JSUnresolvedVariable
        expect(sm.rotate(value)).to.equal(expected);
    });

    it('check rotate library function (offset)', function(){
        var value = 'asd asd',
            expected = 'sd asda';
        // noinspection JSUnresolvedVariable
        expect(sm.rotate(value, 8)).to.equal(expected);
    });

    it('check rotate library function (negative)', function(){
        var value = 'asd asd',
            expected = 'dasd as';
        // noinspection JSUnresolvedVariable
        expect(sm.rotate(value, -1)).to.equal(expected);
    });

    it('check rotate library function (negative offset)', function(){
        var value = 'asd asd',
            expected = 'dasd as';
        // noinspection JSUnresolvedVariable
        expect(sm.rotate(value, -8)).to.equal(expected);
    });

    it('check getMatchingSubstring method for find matches', function(){
        var start = 'poasdf fdfsaf',
            end = 'bgasdfsdfs',
            mValue = 0;
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable
        expect(sm.getMatchingSubstring(start, end, mValue)).to.deep.include({fis: 2, mtc: mValue, sbs: "asdf"});
    });

    it('check diff function with real values 1', function(){
        var start = 'This is a test for see how work the library',
            end = 'This is a test for know how work the new library',
            expected = [ { mtc: 'This is a test for ', del: 'see', ins: 'know', sbs: ' how work the ' }, { mtc: '', del: '', ins: 'new ', sbs: 'library' } ],
            precision = 5;
        // noinspection JSUnresolvedVariable
        expect(sm.diff(start, end, precision)).to.deep.equal(expected);
    });

    it('check diff function with real values without precision parameter', function(){
        var start = 'This is a test for see how work the library',
            end = 'This is a test for know how work the new library',
            expected = [ { mtc: 'This is a test for ', del: 'see', ins: 'know', sbs: ' how work the ' }, { mtc: '', del: '', ins: 'new ', sbs: 'library' } ];
        // noinspection JSUnresolvedVariable
        expect(sm.diff(start, end)).to.deep.equal(expected);
    });

    it('check eraseSpace function', function(){
        var text = '      This     is    a    test      for    see how     work the library   ',
            expected = 'This is a test for see how work the library';
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });

    it('check eraseSpace function empty string', function(){
        var text = '',
            expected = '';
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });

    it('check eraseSpace function only spaces', function(){
        var text = '       ',
            expected = '';
        // noinspection JSUnresolvedVariable
        expect(sm.eraseSpaces(text)).to.equal(expected);
    });

    it('check evaluateCharacterPercent with real data', function(){
        var start = 'Guillermo Gonzalez Jimenez',
            end = 'Guillelmo   Gonzales   Jimenes',
            expected = { good: true, diffs: [ { mtc: 'Guille', del: 'r', ins: 'l', sbs: 'mo Gonzale' }, { mtc: '', del: 'z', ins: 's', sbs: ' Jimene' }, { mtc: '', del: 'z', ins: 's', sbs: '' } ] };
        // noinspection JSUnresolvedVariable
        expect(sm.evaluateCharacterPercent(start, end, 0.6, 5)).to.deep.equal(expected);
    });


});
