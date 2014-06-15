'use strict';

/**
 * lumberjack main entry point
 */

exports = module.exports = function lumberjack(options) {
    var merge = require('merge'),
        _defaults = {
            level: 5
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

    return {
        options: merge(_defaults, options),

        log: function(req, res, next) {
            if (next) {
                next();
            }
        }
    };
};