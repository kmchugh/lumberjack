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

    logger.registerExpress = function(app){
        app.use(function(req, res, next) {
            req._startTime = new Date();
            var logRequest = function() {
                res.removeListener('finish', logRequest);
                res.removeListener('close', logRequest);

                var logFunction = res.statusCode >= 500 ? app.error :
                    res.statusCode >= 400 ? app.warning : app.info;

                logFunction('EXPRESS:request', req.method + ' [' + res.statusCode + ']' + ' - ' + req.url + ' ' + (new Date() - req._startTime) + 'ms', {
                    headers: req.headers,
                    url: req.url,
                    originalUrl: req.originalUrl,
                    method: req.method,
                    query: req.query,
                    statusCode: res.statusCode,
                    session: req.session,
                    executionTime: (new Date() - req._startTime)
                });
            };

            res.on('finish', logRequest);
            res.on('close', logRequest);
            next();
        });
    };
    return logger;
};