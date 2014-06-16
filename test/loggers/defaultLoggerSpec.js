'use strict';

var sut = require('../../lib/lumberjack')();
var expect = require('chai').expect;

describe('default logger', function() {

	it('is of type stdout', function(){
		expect(sut.options.logger).to.be.equal('stdout');
	});

	it('has preset defaults', function(){
        expect(sut.config.format).to.be.equal('[%event%](%date%) - %message%');
    });

	it('will not decorate non objects', function(){
		var logObject = 'logObject';
        sut.decorate(logObject);

        expect(logObject.info).to.be.equal(undefined);
        expect(logObject.debug).to.be.equal(undefined);
        expect(logObject.warning).to.be.equal(undefined);
        expect(logObject.error).to.be.equal(undefined);
	});

	it('can handle an invalid default event', function(){
		var sut = require('../../lib/lumberjack')();
		var logObject = {};
		sut.decorate(logObject);

		sut.config.event = undefined;

		logObject.info('AN EVENT TYPE', 'A log message', {'data':'object'});
	});

	it('can use a function to format the message', function(done){
		var sut = require('../../lib/lumberjack')({
			useColour: false,
			format: function(entry){
				expect(entry).to.not.be.equal(null);
				return 'custom error';
			}
		});
		var logObject = {};
		sut.decorate(logObject);

		logObject.error('AN EVENT TYPE', 'A log message', {'data':'object'});

		sut.config.format = function(entry){
				expect(entry).to.not.be.equal(null);
				done();
				return 'custom log';
			};
		logObject.info('AN EVENT TYPE', 'A log message', {'data':'object'});
	});

	it('can decorate objects for logging', function(){
		var logObject = {};

        expect(logObject.info).to.be.equal(undefined);
        expect(logObject.debug).to.be.equal(undefined);
        expect(logObject.warning).to.be.equal(undefined);
        expect(logObject.error).to.be.equal(undefined);

        sut.decorate(logObject);

        expect(logObject.info).to.be.a('function');
        expect(logObject.debug).to.be.a('function');
        expect(logObject.warning).to.be.a('function');
        expect(logObject.error).to.be.a('function');
	});

	it('can log information messages from a decorated object', function(){
		var logObject = {};
		sut.decorate(logObject);
		expect(logObject.info).to.be.a('function');

		var log = console.log;
		var data = '';
		console.log = function(message){
			data = message;
		};

		logObject.info('event', 'message', {'data':'object'});

		console.log = log;
		console.log(data);
	});

	it('can log debug messages from a decorated object', function(){
		var logObject = {};
		sut.decorate(logObject);
		expect(logObject.debug).to.be.a('function');

		var log = console.log;
		var data = '';
		console.log = function(message){
			data = message;
		};
		logObject.debug('event', 'message', {'data':'object'});

		console.log = log;
		expect(data).to.not.be.equal('');
	});

	it('can log warning messages from a decorated object', function(){
		var logObject = {};
		sut.decorate(logObject);
		expect(logObject.warning).to.be.a('function');

		var log = console.log;
		var data = '';
		console.log = function(message){
			data = message;
		};
		logObject.warning('event', 'message', {'data':'object'});

		console.log = log;
		expect(data).to.not.be.equal('');
	});

	it('can log error messages from a decorated object', function(){
		var logObject = {};
		sut.decorate(logObject);
		expect(logObject.error).to.be.a('function');

		var log = console.log;
		var data = '';
		console.error = function(message){
			data = message;
		};
		logObject.error('event', 'message', {'data':'object'});

		console.error = log;
		expect(data).to.not.be.equal('');
	});
});