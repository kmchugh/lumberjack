'use strict';

/**
 * lumberjack main entry point
 */

exports = module.exports = function lumberjack() {
    return function logger(req, res, next) {
        next();
    };
};