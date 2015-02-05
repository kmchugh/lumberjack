'use strict';

module.exports = function(config){
    var deepExtend = require('deep-extend');

    var _defaults = {
        format : {
            default : '[%event%](%date%) - %message%',
            warning : '[%event%](%date%) - %message%' + require('os').EOL + '%data%',
            error : '[%event%](%date%) - %message%' + require('os').EOL + '%data%',
            debug : '[%event%](%date%) - %message%' + require('os').EOL + '%data%'
        }
    };

    // Make sure we have all of the required config.
    config = deepExtend(_defaults, config);

    // Check all requirements
    if (!config.application)
    {
        throw new Error('Application name is required in config');
    }

    if (!config.applicationVersion)
    {
        throw new Error('Application Version is required in config');
    }

    /**
     * Monitors for duplicates when converting json to strings to prevent circular dependencies
     * @param  {Array} cache the array of objects converted
     * @return {Object}       null if the value has been previously converted
     */
    var duplicateReplacerFunction = function(cache){
        return function(key, value){
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        };
    };

    /**
     * Creates the log entry that is to be logged
     * @param  {String} level   The log level that this entry represents
     * @param  {String} event   The event that is occurring to trigger this log
     * @param  {String|Function} message A string representing the message to log or a function to be executed to return the message to be logged
     * @param  {Object} data    Metadata to store with the event
     * @param  {Object} err     The error object that cause this event if there is one
     * @return {Object}         The log entry object
     */
    var createEntry = function(level, event, message, data, err) {
        return {
            application: 'application Name',
            applicationVersion: 'application Version',
            date: new Date(),
            logLevel: level,
            event: event,
            message: message,
            data: data ? JSON.parse(JSON.stringify(data, duplicateReplacerFunction([]))) : null,
            exception: err && typeof err !== 'function' ? JSON.parse(JSON.stringify(err, duplicateReplacerFunction([]))) : null
        };
    };

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
        format = typeof format === 'object' ? format[entry.logLevel.toLowerCase()] || format['default'] : format;
        var tokens = format.match(/%(.+?)%/g);
        for (var index in tokens)
        {
            var property = tokens[index].replace(/%/g, '');
            format = format.replace(tokens[index], (entry[property] && (typeof entry[property] === 'object' ? JSON.stringify(entry[property], duplicateReplacerFunction([]), '  ') : entry[property])) || (this.config['default' + property.charAt(0).toUpperCase() + property.slice(1)] || ''));
        }
        return format;
    };

    return {
        config: config,
        log: function(/*level, event, message, data, err, callback*/) {
            this.logMessage(createEntry.apply(this, arguments), (arguments.length >= 5 && typeof arguments[arguments.length -1] === 'function') ? arguments[arguments.length -1] : null);
        },
        /**
         * Actually logs the message to the correct medium.  This should be overridden in the subclass
         * @param  {Object} entry The entry object that is being logged
         */
        // This is commented out as it is only meant to be an example of a logMessage function
        /* logMessage : function(entry, callback){
            console.error('The logMessage function for the \'' + this.config.logger + '\' logger type has not been implemented');
            console.log(formatMessage(entry, this.config.format));
            if (callback)
            {
                callback();
            }
        }, */
        formatMessage : formatMessage
    };
};