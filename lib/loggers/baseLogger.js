'use strict';

module.exports = {
    createEntry : function(level, event, message, data, err){
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
            application : 'application Name',
            applicationVersion : 'application Version',
            date: new Date(),
            logLevel : level,
            event : event,
            message : message,
            data: data ? JSON.parse(JSON.stringify(data, duplicateReplacer)) : null,
            exception: err ? JSON.parse(JSON.stringify(err, duplicateReplacer)) : null
        };
    },
    log : function(level, event, message, data, err){
        this.logMessage(this.createEntry(level, event, message, data, err));
    }
};