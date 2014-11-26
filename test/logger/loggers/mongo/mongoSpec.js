/*jshint expr: true*/
'use strict';

var lumberjack = '../../../../lib/lumberjack';
var sut = require(lumberjack)({
                                logger:'mongo',
                                database: '_lumberjackTest',
                                application : 'test app',
                                applicationVersion : 'v0.0.0.0'
                              });
var expect = require('chai').expect;

describe('mongo output logger', function() {

    it('is of type mongo', function(){
        expect(sut.get('logger')).to.be.equal('mongo');
    });

    it('has a default collection', function(){
        expect(sut.get('collection')).to.be.equal('log');
    });

    it('has a default host', function(){
        expect(sut.get('host')).to.be.equal('127.0.0.1');
    });

    it('has a default port', function(){
        expect(sut.get('port')).to.be.equal(27017);
    });

    it('requires a database', function(){
        expect(function(){
            require(lumberjack)({logger:'mongo',
                    application : 'test application',
                    applicationVersion: 'v0.0.0.0'});
        }).to.throw(Error);
    });

    it('will log warning messages to a database', function(done){
        var logObject = {};
        sut.decorate(logObject);

        logObject.warning('EVENT', 'this is a warning message', null, function(err, result){
            expect(err).to.be.null;
            expect(result).to.not.be.null;

            expect(result.message).to.be.equal('this is a warning message');
            expect(result.event).to.be.equal('EVENT');
            expect(result.logLevel).to.be.equal('WARNING');
            expect(result._id).to.not.equal(null);
            done();
        });
    });

    it('will log info messages to a database', function(done){
        var logObject = {};
        sut.decorate(logObject);

        logObject.info('EVENT', 'this is a warning message', null, function(err, result){
            expect(err).to.be.null;
            expect(result).to.not.be.null;

            expect(result.message).to.be.equal('this is a warning message');
            expect(result.event).to.be.equal('EVENT');
            expect(result.logLevel).to.be.equal('INFO');
            expect(result._id).to.not.equal(null);
            done();
        });
    });

    it('will log debug messages to a database', function(done){
        var logObject = {};
        sut.decorate(logObject);

        logObject.debug('EVENT', 'this is a warning message', null, function(err, result){
            expect(err).to.be.null;
            expect(result).to.not.be.null;

            expect(result.message).to.be.equal('this is a warning message');
            expect(result.event).to.be.equal('EVENT');
            expect(result.logLevel).to.be.equal('DEBUG');
            expect(result._id).to.not.equal(null);
            done();
        });
    });

    it('will log debug messages to a database', function(done){
        var logObject = {};
        sut.decorate(logObject);

        logObject.error('EVENT', 'this is a warning message', null, function(err, result){
            expect(err).to.be.null;
            expect(result).to.not.be.null;

            expect(result.message).to.be.equal('this is a warning message');
            expect(result.event).to.be.equal('EVENT');
            expect(result.logLevel).to.be.equal('ERROR');
            expect(result._id).to.not.equal(null);
            done();
        });
    });

    it('can be used without a callback', function(done){
        var logObject = {};
        sut.decorate(logObject);
        var message = '!@#$%^&*()_+!@#$%^&*()_+!@#$%^&*()_+';
        var count = 0;

        logObject.info('EVENT', message, null);

        // recursive function just in case the save to mongo has not occurred
        var find = function(){
            var Model = sut.getLogger('mongo').getModel();
            Model.findOne({message:message}, function(err, result){
                if (result === null && count < 10)
                {
                    count++;
                    find();
                }
                else
                {
                    expect(err).to.be.null;
                    expect(result).to.not.be.null;
                    result.remove();
                    done();
                }
            });
        };

        find();

    });

});