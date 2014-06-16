'use strict';

module.exports = function(config){

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
            logLevel: level,
            event: event,
            message: message,
            data: data ? JSON.parse(JSON.stringify(data, duplicateReplacer)) : null,
            exception: err ? JSON.parse(JSON.stringify(err, duplicateReplacer)) : null
        };
    };

    return {
        config: config,
        log: function(level, event, message, data, err) {
            this.logMessage(createEntry(level, event, message, data, err));
        },
        /**
         * Adds the info, debug, warning, and error methods to the object
         * specified
         * @param  {Object} logObject The object to decorate
         */
        decorate: function(logObject) {
            var self = this;
            if (typeof logObject === 'object') {
                logObject.info = function(event, message, data) {
                    self.log('INFO', event, message, data);
                };

                logObject.debug = function(event, message, data) {
                    self.log('DEBUG', event, message, data);
                };

                logObject.warning = function(event, message, data) {
                    self.log('WARNING', event, message, data);
                };

                logObject.error = function(event, message, data, err) {
                    self.log('ERROR', event, message, data, err);
                };
            }
        }
    };
};