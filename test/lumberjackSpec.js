'use strict';

var expect = require('chai').expect;
describe('lumberjack', function() {
    it('should always work', function() {
        var sut = require('../lib/lumberjack');
        sut();
        expect(1).is.equal(1);
    });
});