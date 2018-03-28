'use strict';

var expect = require('chai').expect;
var sm = require('../lib/string-mismatch');

describe('string-mismatch tests', function() {
    it('check how slice work in javascript', function () {
        var array = [1, 2, 3 ,4];
        expect(array.length).to.equal(4);

        var arrayCopy = array.slice();
        expect(arrayCopy.length).to.equal(4);


    });
});
