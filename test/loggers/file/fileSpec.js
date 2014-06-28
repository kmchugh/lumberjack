/*jshint expr: true*/
'use strict';

var lumberjack = '../../../lib/lumberjack';
var sut = require(lumberjack)({logger:'file'});
var expect = require('chai').expect;
var fs = require('fs'),
    rimraf = require('rimraf'),
    path = require('path');

describe('file output logger', function() {

    it('is of type file', function(){
        expect(sut.options.logger).to.be.equal('file');
    });

    it('has a default file location', function(){
        expect(sut.config.location).to.be.equal(path.resolve('./logs'));
    });

    it('has a default file prefix', function(){
        expect(sut.config.prefix).to.be.equal('log_');
    });

    it('has a default file extension', function(){
        expect(sut.config.extension).to.be.equal('log');
    });

    it('will create the log directory if it does not exist', function(done){
        var logObject = {};
        sut.decorate(logObject);

        var location = sut.config.location;
        sut.config.location = path.resolve('./logs/test/test1');

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.warning('WARNING', 'this is a warning message', null, function(){
                setTimeout(
                    function(){
                        fs.exists(sut.config.location, function(exists){
                            expect(exists).to.be.true;
                            sut.config.location = location;
                            done();
                        });
                    },
                    100
                    );
            });
        });
    });

    it('will log warning messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.warning('WARNING', 'this is a warning message', null, function(){
                fs.readdir(sut.config.location, function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[WARNING\]\(.+\) - this is a warning message\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log info messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.info('INFO', 'this is an info message', null, function(){
                fs.readdir(sut.config.location, function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
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

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.debug('DEBUG', 'this is a debug message', null, function(){
                fs.readdir(sut.config.location, function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[DEBUG\]\(.+\) - this is a debug message\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log error messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.error('ERROR', 'this is an error message', null, null, function(){
                fs.readdir(sut.config.location, function(err, files){
                    if (err)
                    {
                        throw err;
                    }

                    fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                        expect(data.match(/^\[ERROR\]\(.+\) - this is an error message\r?\n$/)).to.not.be.null;
                        done();
                    });
                });
            });
        });
    });

    it('will log multiple messages to a file', function(done){
        var logObject = {};
        sut.decorate(logObject);

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            logObject.info('INFO', 'this is info 1', null, function(){
                logObject.info('INFO', 'this is info 2', null, function(){
                    fs.readdir(sut.config.location, function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            expect(data.match(/^\[INFO\]\(.+\) - this is info 1\r?\n\[INFO\]\(.+\) - this is info 2\r?\n$/)).to.not.be.null;
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

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            var format = sut.config.format;
            sut.config.format = function(){
                return 'this is the entry';
            };

            logObject.info('INFO', 'this is info 1', null, function(){
                    fs.readdir(sut.config.location, function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.config.format = format;
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

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            var format = sut.config.format;
            sut.config.format = '%symbol% [%date%] %message%';

            logObject.info('INFO', 'this is an info message', null, function(){
                    fs.readdir(sut.config.location, function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.config.format = format;
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

        fs.exists(sut.config.location, function(exists){
            if (exists)
            {
                rimraf.sync(sut.config.location);
            }
            var format = sut.config.format;
            sut.config.format = '%symbol% [%date%] %message%';
            sut.config.defaultSymbol = '#';

            logObject.info('INFO', 'this is an info message', null, function(){
                    fs.readdir(sut.config.location, function(err, files){
                        if (err)
                        {
                            throw err;
                        }

                        fs.readFile(sut.config.location + path.sep + files[0], {encoding : 'utf-8'}, function(err, data){
                            sut.config.format = format;
                            expect(data.match(/^# \[.+\] this is an info message\r?\n$/)).to.not.be.null;
                            done();
                        });
                    });
            });
        });
    });
});