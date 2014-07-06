/*jshint expr: true*/
'use strict';

var _lumberjack = '../lib/lumberjack';

var expect = require('chai').expect;
describe('lumberjack', function() {

    it('can be configured', function() {

        expect(require(_lumberjack)({
            application : 'test app',
            applicationVersion : 'v0.0.0.0'
        }).config.level).is.equal(5);

        expect(require(_lumberjack)({
            application : 'test app',
            applicationVersion : 'v0.0.0.0',
            level: 4
        }).config.level).is.equal(4);

        expect(require(_lumberjack)(function() {
            return {
                level: 3,
                application : 'test app',
                applicationVersion : 'v0.0.0.0'
            };
        }).config.level).is.equal(3);


        expect(function() {
            require(_lumberjack)('a string');
        }).to.throw(Error);
    });

    it('can allow for custom options', function() {
        var sut = require(_lumberjack)(function() {
            return {
                test: 12345,
                application : 'test app',
                applicationVersion : 'v0.0.0.0'
            };
        });
        expect(sut.config.test).is.equal(12345);
    });

    it('has preset defaults', function(done){
        var sut = require(_lumberjack)({
            application : 'test app',
            applicationVersion : 'v0.0.0.0'
        });

        expect(sut.config.level).to.be.equal(5);
        expect(sut.config.defaultEvent).to.be.equal('UNKNOWN');
        expect(sut.config.logger).to.be.equal('stdout');
        done();
    });

    it('requires an application name', function(){
        expect(function(){
            require(_lumberjack)({
                applicationVersion : 'v0.0.0.0'
            });
        }).to.throw(Error);
    });

    it('requires an application version', function(){
        expect(function(){
            require(_lumberjack)({
                application : 'test application'
            });
        }).to.throw(Error);
    });

    it('can log express requests', function(){
        var sut = require(_lumberjack)({
                useColour: false,
                application : 'test app',
                applicationVersion : 'v0.0.0.0'
            });

        var data = '';
        var logFunction = console.log;
        var errorFunction = console.error;

        var express = {
            use : function(fnRequest){
                sut.test = fnRequest;
                }
            };

        sut.registerExpress(express);

        var req = {
                method : 'GET',
                url: 'http://www.test.com'
            };
        var res = {
                on : function(event, callback){
                    res[event] = function(){
                        console.log = function(message){
                            data = message;
                        };
                        console.error = function(message){
                            data = message;
                        };
                        callback.apply(this, arguments);
                        console.log = logFunction;
                        console.error = errorFunction;
                    };
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
    });
});