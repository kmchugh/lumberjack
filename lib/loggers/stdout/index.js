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
    var base = require('../baseLogger')(config);

    // Update the defaults required for this logger
    config.format = config.format || '[%event%](%date%) - %message%';

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
    			format = format.replace(tokens[index], entry[property] || (config['default' + property.charAt(0).toUpperCase() + property.slice(1)] || ''));
    		}
    		return format;
    	}
    };

    base.logMessage = function(entry){
    	if (entry && entry.logLevel === 'ERROR')
    	{
    		console.error(formatMessage(entry, config.format));
    	}
    	else
    	{
        	console.log(formatMessage(entry, config.format));
        }
    };

    return base;
};



