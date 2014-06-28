/*jshint expr: true*/
'use strict';

var lumberjack = '../../../lib/lumberjack';
var sut = require(lumberjack)({logger:'stdout'});
var expect = require('chai').expect;

describe('standard output logger', function() {

    /**
     * Wraps console.log so that we can extract the output
     * @return {String} The string that was logged
     */
    var wrapLog = function(callback)
    {
        var data = '';
        var logFunction = console.log;

        console.log = function(message){
            data = message;
        };
        callback();

        console.log = logFunction;
        return data;
    };

    /**
     * Wraps console.error so that we can extract the output
     * @return {String} The string that was logged
     */
    var wrapError = function(callback)
    {
        var data = '';
        var logFunction = console.error;

        console.error = function(message){
            data = message;
        };
        callback();

        console.error = logFunction;
        return data;
    };

    it('is of type stdout', function(){
        expect(sut.options.logger).to.be.equal('stdout');
    });

    it('has preset defaults', function(){
        expect(sut.config.format).to.be.equal('[%event%](%date%) - %message%');
    });

    it('logs warning messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
            logObject.warning('WARNING', 'this is a warning message');
        });
        expect(data.match(/^\[\x1b\[90mWARNING\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[33mthis is a warning message\x1b\[0m$/)).to.not.be.null;
    });

    it('logs debug messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
            logObject.debug('DEBUG', 'this is a debug message');
        });
        expect(data.match(/^\[\x1b\[90mDEBUG\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[34mthis is a debug message\x1b\[0m$/)).to.not.be.null;
    });

    it('logs info messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
            logObject.info('INFO', 'this is an info message');
        });
        expect(data.match(/^\[\x1b\[90mINFO\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[36mthis is an info message\x1b\[0m$/)).to.not.be.null;
    });

    it('logs errors to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapError(function(){
            logObject.error('ERROR', 'this is an error message');
        });
        expect(data.match(/^\[\x1b\[31mERROR\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[31mthis is an error message\x1b\[0m$/)).to.not.be.null;
    });

    it('does not log warning messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        wrapLog(function(){
            var data = wrapError(function(){
                logObject.warning('WARNING', 'this is a warning message');
            });
            expect(data).to.be.equal('');
        });
    });

     it('does not log debug messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        wrapLog(function(){
            var data = wrapError(function(){
                logObject.debug('DEBUG', 'this is a debug message');
            });
            expect(data).to.be.equal('');
        });
    });

     it('does not log info messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        wrapLog(function(){
            var data = wrapError(function(){
                logObject.info('INFO', 'this is an info message');
            });
            expect(data).to.be.equal('');
        });
    });

    it('does not log error messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        wrapError(function(){
            var data = wrapLog(function(){
                logObject.error('ERROR', 'this is an error message');
            });
            expect(data).to.be.equal('');
        });
    });

    it('can log debug messages in monochorme', function(){
        sut.config.useColour = false;
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
                logObject.debug('DEBUG', 'this is a debug message');
            });

        expect(data.match(/^\[DEBUG\]\(.+\) - this is a debug message$/)).to.not.be.null;

        sut.config.useColour = true;
    });

    it('can log info messages in monochorme', function(){
        sut.config.useColour = false;
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
                logObject.info('INFO', 'this is an info message');
            });

        expect(data.match(/^\[INFO\]\(.+\) - this is an info message$/)).to.not.be.null;

        sut.config.useColour = true;
    });

    it('can log warning messages in monochorme', function(){
        sut.config.useColour = false;
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapLog(function(){
                logObject.warning('WARNING', 'this is a warning message');
            });

        expect(data.match(/^\[WARNING\]\(.+\) - this is a warning message$/)).to.not.be.null;

        sut.config.useColour = true;
    });

    it('can log error messages in monochorme', function(){
        sut.config.useColour = false;
        var logObject = {};
        sut.decorate(logObject);

        var data = wrapError(function(){
                logObject.error('ERROR', 'this is an error message');
            });

        expect(data.match(/^\[ERROR\]\(.+\) - this is an error message$/)).to.not.be.null;

        sut.config.useColour = true;
    });
});