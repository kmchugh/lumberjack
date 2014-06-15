'use strict';

var _lumberjack = '../lib/lumberjack';

var expect = require('chai').expect;
describe('lumberjack', function() {

        it('can be configured', function() {

                expect(require(_lumberjack)().options.level).is.equal(5);

                expect(require(_lumberjack)({
                    level: 4
                }).options.level).is.equal(4);

                expect(require(_lumberjack)(function() {
                    return {
                        level: 3
                    };
                }).options.level).is.equal(3);


                expect(function(){require(_lumberjack)('a string');}).to.throw(Error);
            });

            it('can allow for custom options', function() {
                var sut = require(_lumberjack)(function() {
                    return {
                        test:12345
                    };
                });
                expect(sut.options.test).is.equal(12345);
            });

            it('has a log function', function() {
                var sut = require(_lumberjack)();
                sut.log();
                sut.log(null, null, function() {});
            });
        });