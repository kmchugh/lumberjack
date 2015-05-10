# lumberjack
*Clearcut logging for Node.js and friends.*

[![GitHub version](http://img.shields.io/github/tag/kmchugh/lumberjack.svg?branch=master)](http://github.com/kmchugh/lumberjack)
[![Build Status](https://travis-ci.org/kmchugh/lumberjack.svg?branch=master)](https://travis-ci.org/kmchugh/lumberjack)
[![Coverage Status](https://coveralls.io/repos/kmchugh/lumberjack/badge.png?branch=master)](https://coveralls.io/r/kmchugh/lumberjack?branch=master)
[![Dependency Status](https://gemnasium.com/kmchugh/lumberjack.svg)](https://gemnasium.com/kmchugh/lumberjack)

## How to use

Include the library in your package.json file

	{
    	"name": "myApplication",
    	"dependencies": {
        	"lumberjack": "git://github.com/kmchugh/lumberjack.git",
        }
    }

Require and configure the lumberjack logger

	var lumberjack = require('lumberjack')({
			application : require('package.json').name,
			version : require('package.json').version
		});

Decorate an object for logging

	lumberjack.decorate(app);

Log

    app.info('EVENT:OCCURRED', 'Message for event', {some: 'data'});

or

    app.i('EVENT:OCCURRED', 'Message for event', {some: 'data'});

The logger object is already decorated so you can also log directly from the logger

    lumberjack.info('EVENT:OCCURRED', 'Message for event', {some: 'data'});

or

    lumberjack.i('EVENT:OCCURRED', 'Message for event', {some: 'data'});

### Methods and parameters

Once an object has been decorated as a logger it will have additional methods added to the object.

Those methods are:

- **debug** 	- used for debug messages
- **info** 		- used for capturing any informational events
- **warning** 	- used for logging any warnings that may occur
- **error** 	- used for capturing any errors that require attention

A shortened version of those methods is also made available

- **d**   - used for debug messages
- **i**    - used for capturing any informational events
- **w**   - used for logging any warnings that may occur
- **e**   - used for capturing any errors that require attention

Each of the methods take the following parameters:

- **Event**, 	[*String*] 			- The event that is being logged, can be used to group messages
- **Message**, 	[*String/Function*] - The string to log or a function that will return the string to log
- **Data**, 	[*Object*] 			- The data to capture with the event that occurred
- **Error**, 	[*Object*] 			- The error that occurred if there is one
- **Callback**, [*Function*] 		- The function to call after the event has been logged


### Configuration

#### stdout logger

The stdout logger is the default logger.  This logger will simply output any events to the console

Valid configuration options are :

- **format**,		[*Object*] 			- The list of formats to use for each of the log types
- **colours**, 		[*Object*] 			- The list of colours to use for each of the log types
- **showColours**,	[*Boolean*] 		- true to log in colour, false to log monochrome

#### file logger

The file logger outputs to a file.

Valid configuration options are :

- **format**,		[*Object*] 			- The list of formats to use for each of the log types
- **location**,		[*String*] 			- The path to the location of the log files
- **prefix**, 		[*String*] 			- The prefix for any log files created
- **extension**,	[*String*] 			- The file extension for log files created

#### mongo logger

The mongo logger outputs to a mongo collection.

Valid configuration options are :

- **collection**,	[*Object*] 			- The list of formats to use for each of the log types
- **location**,		[*String*] 			- The path to the location of the log files
- **prefix**, 		[*String*] 			- The prefix for any log files created
- **extension**,	[*String*] 			- The file extension for log files created

#### multiple loggers

#### using callbacks


## How to use with express

### Request Logging

### API and Route creation

