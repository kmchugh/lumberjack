'use strict';

/**
 * File logger, logs files out to the specified file
 *
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
module.exports = function(config){
    var merge = require('merge');
    var fs = require('fs');
    var path = require('path');

    var mkdir = function(dir, callback){
        fs.mkdir(dir, function(error){
            if (error && error.errno === 34)
            {
                mkdir(path.dirname(dir));
                mkdir(dir);
                error = null;
            }
            if (callback)
            {
                callback(error);
            }
        });
    };

    var pad = function(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    // Update the defaults required for this logger
    var _defaults = {
        location : './logs',
        prefix: 'log_',
        extension: 'log'
    };

    var getFile = function()
    {
        var date = new Date();
        return path.normalize(this.config.location + path.sep + this.config.prefix +
                pad(date.getFullYear(), 4) +
                pad(date.getMonth(), 2) +
                pad(date.getDate(), 2) +
                '.' + this.config.extension);
    };

    var base = require('../baseLogger')(merge(_defaults, config));

    base.logMessage = function(entry, callback){
        // Get the file we are going to write to
        var file = getFile.call(this);

        fs.exists(base.config.location, function(exists){
            if (!exists)
            {
                mkdir(path.dirname(file), function(){
                    fs.appendFile(file, base.formatMessage(entry, base.config.format) + require('os').EOL, function(err){
                        callback(err);
                    });
                });
            }
            else
            {
                fs.appendFile(file, base.formatMessage(entry, base.config.format) + require('os').EOL, function(err){
                        callback(err);
                });
            }
        });
    };

    return base;
};


