'use strict';

module.exports = (function(){
    var base = require('../baseLogger');

    base.logMessage = function(entry){
        console.log(entry);
    };

    return base;
})();



