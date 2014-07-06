/*jshint expr: true*/
'use strict';

var sut = require('../../lib/lumberjack')({
	application : 'test app',
	applicationVersion : 'v0.0.0.0'
});
var expect = require('chai').expect;

describe('default logger', function() {

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
		expect(sut.get('logger')).to.be.equal('stdout');
	});

	it('has preset defaults', function(){
		expect(sut.get('format').default).to.be.equal('[%event%](%date%) - %message%');
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
		var sut = require('../../lib/lumberjack')({
			application : 'test app',
    			applicationVersion : 'v0.0.0.0'
		});
		var logObject = {};
		sut.decorate(logObject);

		sut.set('event', undefined);
		var data = wrapLog(function(){
			logObject.info('AN EVENT TYPE', 'A log message', {'data':'object'});
		});
		expect(data.match(/^\[\x1b\[36mAN EVENT TYPE\x1b\[0m\]\(\x1b\[90m.+\x1b\[0m\) - \x1b\[36mA log message\x1b\[0m$/)).to.not.be.null;
	});

	it('can use a function to format the message', function(done){
		var sut = require('../../lib/lumberjack')({
			useColour: false,
			application : 'test app',
    			applicationVersion : 'v0.0.0.0',
			format: function(entry){
				expect(entry).to.not.be.equal(null);
				return 'custom error';
			}
		});
		var logObject = {};
		sut.decorate(logObject);

		var data = wrapError(function(){
			logObject.error('AN EVENT TYPE', 'A log message', {'data':'object'});
		});
		expect(data).to.be.equal('custom error');

		sut.set('format', function(entry){
				expect(entry).to.not.be.equal(null);
				done();
				return 'custom log';
			});

		data = wrapLog(function(){
			logObject.info('AN EVENT TYPE', 'A log message', {'data':'object'});
		});
		expect(data).to.be.equal('custom log');
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

	it('can log with custom formats', function(){
		var sut = require('../../lib/lumberjack')({
			format: '%message% - %data%%random%',
			application : 'test app',
    			applicationVersion : 'v0.0.0.0'
		});

		var logObject = {};
		sut.decorate(logObject);

		var data = wrapLog(function(){
			logObject.info('info event', 'info message', 'test');
		});
		expect(data.match(/^\x1b\[36minfo message\x1b\[0m - \x1b\[37mtest\x1b\[0m\x1b\[90m\x1b\[0m$/)).to.not.be.null;

		sut.set('useColour', false);

		data = wrapLog(function(){
			logObject.info('info event', 'info message', 'test');
		});
		expect(data.match(/^info message - test$/)).to.not.be.null;

	});

	it('stores a reference in the log object', function(){
		var logObject = {};
		sut.decorate(logObject);

		expect(logObject._lumberjack).to.be.equal(sut);
	});

	it('can log data with circular references', function(done){
		var logObject = {};
		sut.decorate(logObject);
		sut.logObject = logObject;
		logObject.sut = sut;

		var logFunction = console.log;
		console.log = function(){};

		logObject.warning('CIRCULAR', 'this message contains a circular reference', sut, sut, function(){
			console.log = logFunction;
			done();
		});
	});
});