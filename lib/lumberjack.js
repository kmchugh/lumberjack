'use strict';

/**
 * lumberjack main entry point
 *
 * configuration parameters:
 * logger String the type of logger to use for this instance
 * default* : default value for a specified token, * would be replaced with a caplitalised version of the token
 *     for example, defaultEvent or defaultBigproperty.
 */

exports = module.exports = function lumberjack(options) {
    var merge = require('merge'),
        _defaults = {
            level: 5,
            logger: 'stdout',
            defaultEvent: 'UNKNOWN',
            defaultLevel: 'INFO'
        };
    if (options && typeof options !== 'object') {
        if (typeof options === 'function') {
            options = options();
        }
        else
        {
        	throw new Error('Invalid options');
        }
    }

    // Override settings from the defaults with the options passed in
    var config = merge(_defaults, options);

    var logger = require('./loggers/' + config.logger)(config);
    logger.options = config;
    return logger;
};