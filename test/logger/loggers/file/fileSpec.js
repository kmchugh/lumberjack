/*jshint expr: true*/
'use strict';

var lumberjack = '../../../../lib/lumberjack';
var sut = require(lumberjack)({
    logger:'file',
    application : 'test app',
    applicationVersion : 'v0.0.0.0'
});
var expect = require('chai').expect;
var fs = require('fs'),
    rimraf = require('rimraf'),
    path = require('path');

describe('file output logger', function() {

    it('is of type file', function(){
        expect(sut.get('logger')).to.be.equal('file');
    });

    it('has a default file location', function(){
        expect(sut.get('location')).to.be.equal(path.resolve('./logs'));
    });

    it('has a default file prefix', function(){
        expect(sut.get('prefix')).to.be.equal('log');
    });

    it('has a default file extension', function(){
        expect(sut.get('extension')).to.be.equal('log');
    });

    it('will create the log directory if it does not exist', function(done){
        var logObject = {};
        sut.decorate(logObject);

        var location = sut.get('location');
        sut.set('location', path.resolve('./logs/test/test1'));

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.warning('WARNING', 'this is a warning message', null, function(){
                setTimeout(
                    function(){
                        fs.exists(sut.get('location'), function(exists){
                            expect(exists).to.be.true;
                            sut.set('location', location);
                            done();
                        });
                    },
                    30
                    );
            });
        });
    });

    it('can be used without a callback', function(done){
        var logObject = {};
        sut.decorate(logObject);
        var message = '!@#$%^&*()_+!@#$%^&*()_+!@#$%^&*()_+';
        var count = 0;

        logObject.info('EVENT', message, null);

        done();

    });

    it('will log warning messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.warning('WARNING', 'this is a warning message', null, function(){
                fs.readdir(sut.get('location'), function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[WARNING\]\(.+\) - this is a warning message\r?\n\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log info messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.info('INFO', 'this is an info message', null, function(){
                fs.readdir(sut.get('location'), function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[INFO\]\(.+\) - this is an info message\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log debug messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.debug('DEBUG', 'this is a debug message', null, function(){
                fs.readdir(sut.get('location'), function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[DEBUG\]\(.+\) - this is a debug message\r?\n\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log error messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.error('ERROR', 'this is an error message', null, null, function(){
                fs.readdir(sut.get('location'), function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[ERROR\]\(.+\) - this is an error message\r?\n\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log multiple messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            logObject.warning('WARNING', 'this is info 1', {some: 'data'}, function(){
                logObject.info('INFO', 'this is info 2', null, function(){
                    fs.readdir(sut.get('location'), function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            expect(data.match(/^\[WARNING\]\(.+\) - this is info 1\r?\n{\r?\n  "some": "data"\r?\n}\r?\n\[INFO\]\(.+\) - this is info 2\r?\n$/)).to.not.be.null;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('will allow alternative formats', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            var format = sut.get('format');
            sut.set('format', function(){
                return 'this is the entry';
            });

            logObject.info('INFO', 'this is info 1', null, function(){
                    fs.readdir(sut.get('location'), function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.set('format', format);
                            expect(data.match(/^this is the entry\r?\n$/)).to.not.be.null;
                            done();
                        });
                    });
            });
        });
    });

    it('will allow alternative tokens', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            var format = sut.get('format');
            sut.set('format', '%symbol% [%date%] %message%');

            logObject.info('INFO', 'this is an info message', null, function(){
                    fs.readdir(sut.get('location'), function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.set('format', format);
                            expect(data.match(/^ \[.+\] this is an info message\r?\n$/)).to.not.be.null;
                            done();
                        });
                    });
            });
        });
    });

    it('will allow default values for alternative tokens', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.get('location'), function(exists){
            if (exists)
            {
                rimraf.sync(sut.get('location'));
            }
            var format = sut.get('format');
            sut.set('format', '%symbol% [%date%] %message%');
            sut.set('defaultSymbol', '#');

            logObject.info('INFO', 'this is an info message', null, function(){
                    fs.readdir(sut.get('location'), function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.get('location') + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.set('format', format);
                            expect(data.match(/^# \[.+\] this is an info message\r?\n$/)).to.not.be.null;
                            done();
                        });
                    });
            });
        });
    });
});