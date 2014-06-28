'use strict';

module.exports = function(config){
    var merge = require('merge');

    var _defaults = {
        format : '[%event%](%date%) - %message%'
    };

    // Make sure we have all of the required config.
    config = merge(_defaults, config);

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
        var cache = [];
        var duplicateReplacer = function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        };

        return {
            application: 'application Name',
            applicationVersion: 'application Version',
            date: new Date(),
            logLevel: level || 'INFO',
            event: event || this.config.defaultEvent,
            message: message,
            data: data ? JSON.parse(JSON.stringify(data, duplicateReplacer)) : null,
            exception: err ? JSON.parse(JSON.stringify(err, duplicateReplacer)) : null
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
        else
        {
            var tokens = format.match(/%(.+?)%/g);
            for (var index in tokens)
            {
                var property = tokens[index].replace(/%/g, '');
                format = format.replace(tokens[index], entry[property] || (this.config['default' + property.charAt(0).toUpperCase() + property.slice(1)] || ''));
            }
            return format;
        }
    };

    return {
        config: config,
        log: function(level, event, message, data, err, callback) {
            this.logMessage(createEntry.call(this, level, event, message, data, err), callback);
        },
        /**
         * Adds the info, debug, warning, and error methods to the object
         * specified
         * @param  {Object} logObject The object to decorate
         */
        decorate: function(logObject) {
            var self = this;
            if (typeof logObject === 'object') {
                logObject.info = function(event, message, data, callback) {
                    self.log('INFO', event, message, data, null, callback);
                };

                logObject.debug = function(event, message, data, callback) {
                    self.log('DEBUG', event, message, data, null, callback);
                };

                logObject.warning = function(event, message, data, callback) {
                    self.log('WARNING', event, message, data, null, callback);
                };

                logObject.error = function(event, message, data, err, callback) {
                    self.log('ERROR', event, message, data, err, callback);
                };
            }
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