'use strict';

var expect = require('chai').expect;
var sm = require('../lib/string-mismatch');

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
});
