/*jshint expr: true*/
'use strict';

var _lumberjack = '../lib/lumberjack';

var expect = require('chai').expect;
describe('lumberjack', function() {

    it('can be configured', function() {

        expect(require(_lumberjack)().config.level).is.equal(5);

        expect(require(_lumberjack)({
            level: 4
        }).config.level).is.equal(4);

        expect(require(_lumberjack)(function() {
            return {
                level: 3
            };
        }).config.level).is.equal(3);


        expect(function() {
            require(_lumberjack)('a string');
        }).to.throw(Error);
    });

    it('can allow for custom options', function() {
        var sut = require(_lumberjack)(function() {
            return {
                test: 12345
            };
        });
        expect(sut.config.test).is.equal(12345);
    });

    it('has preset defaults', function(done){
        var sut = require(_lumberjack)();

        expect(sut.config.level).to.be.equal(5);
        expect(sut.config.defaultEvent).to.be.equal('UNKNOWN');
        expect(sut.config.logger).to.be.equal('stdout');
        done();
    });

    it('can log express requests', function(done){
        var sut = require(_lumberjack)({useColour: false});
        var express = {
            use : function(fnRequest){
                sut.test = fnRequest;
                }
            };

        var data = '';
        var logFunction = console.log;
        var errorFunction = console.error;

        console.log = function(message){
            data = message;
        };
        console.error = function(message){
            data = message;
        };

        sut.decorate(express);
        sut.registerExpress(express);

        var req = {
                method : 'GET',
                url: 'http://www.test.com'
            };
        var res = {
                on : function(event, callback){
                    res[event] = callback;
                },
                removeListener : function(event){
                    res[event] = null;
                },
                statusCode: 200
            };
        var next = function(){};

        sut.test(req, res, next);
        res.finish();
        expect(data.match(/^\[EXPRESS:request\]\(\".+\"\) - GET \[200\] - http:\/\/www.test.com 0ms$/)).to.not.be.null;

        res.statusCode = 400;

        sut.test(req, res, next);
        res.finish();
        expect(data.match(/^\[EXPRESS:request\]\(\".+\"\) - GET \[400\] - http:\/\/www.test.com 0ms\r?\n\{\r?\n  \"url\": \"http:\/\/www.test.com\",\r?\n  \"method\": \"GET\",\r?\n  \"statusCode\": 400,\r?\n  \"executionTime\": 0\r?\n\}$/)).to.not.be.null;

        res.statusCode = 500;

        sut.test(req, res, next);
        res.finish();
        expect(data.match(/^\[EXPRESS:request\]\(\".+\"\) - GET \[500\] - http:\/\/www.test.com 0ms\r?\n\{\r?\n  \"url\": \"http:\/\/www.test.com\",\r?\n  \"method\": \"GET\",\r?\n  \"statusCode\": 500,\r?\n  \"executionTime\": 0\r?\n\}$/)).to.not.be.null;

        console.log = logFunction;
        console.error = errorFunction;

        done();
    });
});