'use strict';

/**
 * lumberjack main entry point
 */

exports = module.exports = function lumberjack(options) {
    var merge = require('merge'),
        _defaults = {
            level: 5,
            logger: 'cout'
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

    var logger = require('./loggers/' + config.logger);
    logger.options = config;
    return logger;
};