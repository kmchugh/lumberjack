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
    var deepExtend = require('deep-extend'),
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
    var config = deepExtend(_defaults, options);

    var loggerList = {};
    var firstLogger = null;
    var loggerCount = 0;


    /**
     * Gets a property of the object specified, this allows for deep linking
     * @param  {Object} object   the object to retrieve the property from
     * @param  {String} property the property to retrieve the value of
     * @return {Object}          the value of the property or undefined
     */
    var getProperty = function(object, property)
    {
        if (property.indexOf('.') >= 0)
        {
            var propertyMap = property.split('.');
            var head = propertyMap[0];
            propertyMap.splice(0,1);
            var tail = propertyMap.join('.');
            return getProperty(object[head], tail);
        }
        else
        {
            return object[property];
        }
    };


    var logger = (function(){
        if (typeof config.logger === 'string')
        {
            var createdConfig = {};
            createdConfig[config.logger] = {};
            config.logger = createdConfig;
        }

        var allConfigs = config.logger;
        for (var logConfig in allConfigs)
        {
            config.logger = logConfig;
            firstLogger = firstLogger || logConfig;
            loggerList[logConfig] = require('./loggers/' + logConfig)(deepExtend(allConfigs[logConfig], config));
            loggerCount++;
        }

        return {
            /**
             * Gets the property specified
             * @return {Object} the value of the property specified
             */
            get: function(/*[loggerType, ] property*/){
                return arguments.length === 1 ?
                    getProperty(loggerList[firstLogger].config, arguments[0]) :
                    getProperty(loggerList[arguments[0]].config, arguments[1]);
            },
            /**
             * Sets the value of the property specified
             */
            set: function(/*[loggerType, ]property, value*/){
                if (arguments.length === 2)
                {
                    loggerList[firstLogger].config[arguments[0]] = arguments[1];
                }
                else
                {
                    loggerList[arguments[0]].config[arguments[1]] = arguments[2];
                }
            },
            /**
             * Gets the specified logger
             * @param  {String} loggerType the logger to get
             * @return {baseLogger}            the logger that was requested
             */
            getLogger: function(loggerType){
                return loggerList[loggerType];
            }
        };
    })(config);

    /**
     * Adds the info, debug, warning, and error methods to the object
     * specified
     * @param  {Object} logObject The object to decorate
     */
    logger.decorate = function(logObject){
        if (typeof logObject === 'object' || typeof logObject === 'function') {
            logObject._lumberjack=logger;
            ['info', 'debug', 'warning', 'error'].map(function(level){
                    logObject[level] = function(){
                        if (typeof arguments[arguments.length -1] === 'function' && loggerCount > 1)
                        {
                            var callback = arguments[arguments.length -1];
                            var counter = 0;
                            arguments[arguments.length -1] = function(){
                                counter ++;
                                if (counter >= loggerCount)
                                {
                                    callback(arguments);
                                }
                            };
                        }
                        for (var loggerObject in loggerList)
                        {
                            loggerList[loggerObject].log.apply(loggerList[loggerObject], [level.toUpperCase()].concat(Array.prototype.slice.call(arguments, 0)));
                        }
                    };
            });
        }
    };

    /**
     * Decorates the express app with the log functions.  Registers the logger to ensure all requests are correctly logged
     * @param  {Express} app Express application
     */
    logger.registerExpress = function(app){
        logger.decorate(app);
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