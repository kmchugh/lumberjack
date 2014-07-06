'use strict';

/**
 * mongo logger, this logger outputs stored to mongodb
 *
 */
module.exports = function(config){
	var merge = require('merge');

	// Update the defaults required for this logger
    var _defaults = {
        collection : 'log',
        host : '127.0.0.1',
        port : 27017
    };

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var base = require('../baseLogger')(merge(_defaults, config));

    if (!base.config.database)
    {
        throw new Error('A database name is required');
    }
    // Create the connection
    var dbPath = 'mongodb://' + base.config.host + ':' + base.config.port + '/' + base.config.database;
    mongoose.connect(dbPath);

    // Create the schema if needed
    var LogModel = null;
    try
    {
        LogModel = mongoose.model('Lumberjack_LogEntry');
    }
    catch(ex)
    {
        // Create the log entry schema
        var logEntrySchema = new Schema({
            application: {          // The unique identifier of the application that is being logged for
                type: String,
                required: true
            },
            applicationVersion: {   // The version of the application
                type: String,
                required: true
            },
            date: {                 // The date this log entry was logged
                type : Date,
                required: true
            },
            logLevel: {             // The log level of this entry
                type : String,
                required : true
            },
            event: {                // The event that is being logged
                type : String,
                required : true
            },
            message: {              // The message that is being logged
                type: String,
                default: '',
                trim: true
            },
            data: {                 // The data for the log
                type: Schema.Types.Mixed
            },
            exception: {            // The exception that occurred if any
                type: Schema.Types.Mixed
            },
            createdDate: { // The date this record was created
                type: Date,
                default: Date.now()
            }
        }, {
            safe: {
                w: 0,
                wtimeout: 10000,
                collection: base.config.collection
            }
        });
        mongoose.model('Lumberjack_LogEntry', logEntrySchema);
        LogModel = mongoose.model('Lumberjack_LogEntry');
    }

    /**
     * Allows access to the model object being used by mongoose for the log entrires
     * @return {Model} the log entry model
     */
    base.getModel = function(){
        return LogModel;
    };

    base.logMessage = function(entry, callback)
    {
        var logEntry = new LogModel(entry);
        logEntry.save(function(err, result){
            if (callback)
            {
                callback(err, result);
            }
        });
    };

    return base;
};



