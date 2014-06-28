'use strict';

/**
 * stdout default logger, this logger outputs to the standard output using console.log or console.error
 *
 * configuration parameters:
 * format String|Function allows for custom formatting of the logs
 * 		if this is a string then any tokens are identified by wrapping a word with %
 * 		for example: 'this is a %token%' where token will be identified.  Tokens will be replaced
 * 		with data from the 
 * 
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
module.exports = function(config){
	var merge = require('merge');

	// Update the defaults required for this logger
    var _defaults = {
    	colours : {
    		'default' : {
    			'event' : 90,
    			'date'	: 90,
    			'message' : 36,
    			'default' : 90
    		},
    		'error' : {
    			'event' : 31,
    			'date'	: 90,
    			'message' : 31,
    			'default' : 90
    		},
    		'warning' : {
    			'event' : 90,
    			'date'	: 90,
    			'message' : 33,
    			'default' : 90
    		},
    		'debug' : {
    			'event' : 90,
    			'date'	: 90,
    			'message' : 34,
    			'default' : 90
    		}
    	},
    	useColour : true
    };

    var base = require('../baseLogger')(merge(_defaults, config));

    /**
     * Formats the specified message
     * @param  {Object} entry   the message entry to format
     * @param  {String|Function} format  the string or function to use for formatting
     * @return {String}         the formatted message
     */
    var formatMessage = function(entry, format)
    {
    	if (typeof format === 'function')
    	{
    		return format(entry);
    	}
    	else
    	{
    		var tokens = format.match(/%(.+?)%/g);
    		for (var index in tokens)
    		{
    			var property = tokens[index].replace(/%/g, '');
    			var colour = base.config.colours[entry.logLevel.toLowerCase()] || base.config.colours['default'];

    			format = base.config.useColour ?
    				format.replace(tokens[index], '\x1b[' + (colour[property] || '90') + 'm' + (entry[property] || (base.config['default' + property.charAt(0).toUpperCase() + property.slice(1)] || '')) + '\x1b[0m') :
    				format.replace(tokens[index], entry[property] || (base.config['default' + property.charAt(0).toUpperCase() + property.slice(1)] || ''));
    		}
    		return format;
    	}
    };

    base.logMessage = function(entry){
    	if (entry && entry.logLevel === 'ERROR')
    	{
    		console.error(formatMessage(entry, base.config.format));
    	}
    	else
    	{
        	console.log(formatMessage(entry, base.config.format));
        }
    };

    return base;
};



