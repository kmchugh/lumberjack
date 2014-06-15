/**
 * lumberjack main entry point
 */

exports = module.exports = function lumberjack(options) {
    return function logger(req, res, next) {
        next();
    };
};