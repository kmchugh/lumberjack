/*jshint expr: true*/
'use strict';

var lumberjack = '../../../lib/lumberjack';
var sut = require(lumberjack)({
                logger:'stdout',
                application : 'test app',
                applicationVersion : 'v0.0.0.0'
            });
var expect = require('chai').expect;
var helper = require('../../helpers/testFunctions');

describe('standard output logger (stdoutSpec.js)', function() {

    it('is of type stdout', function(){
        expect(sut.get('logger')).to.be.equal('stdout');
    });

    it('has preset defaults', function(){
        expect(sut.get('format').default).to.be.equal('[%event%](%date%) - %message%');
    });

    it('logs warning messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
            logObject.warning('WARNING', 'this is a warning message');
        });
        expect(data.match(/^\[\x1b\[33mWARNING\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[33mthis is a warning message\x1b\[0m\r?\n\x1b\[90m\x1b\[0m$/)).to.not.be.null;
    });

    it('logs debug messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
            logObject.debug('DEBUG', 'this is a debug message');
        });
        expect(data.match(/^\[\x1b\[90mDEBUG\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[90mthis is a debug message\x1b\[0m\r?\n\x1b\[37m\x1b\[0m$/)).to.not.be.null;
    });

    it('logs info messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
            logObject.info('INFO', 'this is an info message');
        });
        expect(data.match(/^\[\x1b\[36mINFO\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[36mthis is an info message\x1b\[0m$/)).to.not.be.null;
    });

    it('logs errors to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapError(function(){
            logObject.error('ERROR', 'this is an error message');
        });
        expect(data.match(/^\[\x1b\[31mERROR\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[31mthis is an error message\x1b\[0m\r?\n\x1b\[90m\x1b\[0m$/)).to.not.be.null;
    });

    it('does not log warning messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        helper.wrapLog(function(){
            var data = helper.wrapError(function(){
                logObject.warning('WARNING', 'this is a warning message');
            });
            expect(data).to.be.equal('');
        });
    });

     it('does not log debug messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        helper.wrapLog(function(){
            var data = helper.wrapError(function(){
                logObject.debug('DEBUG', 'this is a debug message');
            });
            expect(data).to.be.equal('');
        });
    });

     it('does not log info messages to standard error output', function(){
        var logObject = {};
        sut.decorate(logObject);

        helper.wrapLog(function(){
            var data = helper.wrapError(function(){
                logObject.info('INFO', 'this is an info message');
            });
            expect(data).to.be.equal('');
        });
    });

    it('does not log error messages to standard output', function(){
        var logObject = {};
        sut.decorate(logObject);

        helper.wrapError(function(){
            var data = helper.wrapLog(function(){
                logObject.error('ERROR', 'this is an error message');
            });
            expect(data).to.be.equal('');
        });
    });

    it('can log debug messages in monochorme', function(){
        sut.set('showColours', false);
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
                logObject.debug('DEBUG', 'this is a debug message');
            });

        expect(data.match(/^\[DEBUG\]\(.+\) - this is a debug message\r?\n$/)).to.not.be.null;

        sut.set('showColours', true);
    });

    it('can log info messages in monochorme', function(){
        sut.set('showColours', false);
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
                logObject.info('INFO', 'this is an info message');
            });

        expect(data.match(/^\[INFO\]\(.+\) - this is an info message$/)).to.not.be.null;

        sut.set('showColours', true);
    });

    it('can log warning messages in monochorme', function(){
        sut.set('showColours', false);
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapLog(function(){
                logObject.warning('WARNING', 'this is a warning message');
            });

        expect(data.match(/^\[WARNING\]\(.+\) - this is a warning message\r?\n$/)).to.not.be.null;

        sut.set('showColours', true);
    });

    it('can log error messages in monochorme', function(){
        sut.set('showColours', false);
        var logObject = {};
        sut.decorate(logObject);

        var data = helper.wrapError(function(){
                logObject.error('ERROR', 'this is an error message');
            });

        expect(data.match(/^\[ERROR\]\(.+\) - this is an error message\r?\n$/)).to.not.be.null;

        sut.set('showColours', true);
    });

    it('can handle a callback after logging', function(done){
        var logObject = {};
        sut.decorate(logObject);

        helper.wrapLog(function(){
                logObject.info('EVENT', 'message', null, function(){
                done();
            });
        });
    });
});