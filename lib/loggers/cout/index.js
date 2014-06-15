'use strict';

module.exports = function(config){
    var base = require('../baseLogger')(config);

    base.logMessage = function(entry){
    	if (entry && entry.logLevel === 'ERROR')
    	{
    		console.error(entry);
    	}
    	else
    	{
        	console.log(entry);
        }
    };

    return base;
};



