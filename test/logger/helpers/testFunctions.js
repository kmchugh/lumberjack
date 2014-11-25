/*jshint expr: true*/
'use strict';

// Helper functions for the tests
module.exports = {
  /**
   * Wraps console.log so that we can extract the output
   * @return {String} The string that was logged
   */
  wrapLog: function(callback)
  {
    var data = '';
    var logFunction = console.log;

    console.log = function(message){
      data = message;
    };
    callback();

    console.log = logFunction;
    return data;
  },

  /**
   * Wraps console.error so that we can extract the output
   * @return {String} The string that was logged
   */
  wrapError: function(callback)
  {
    var data = '';
    var logFunction = console.error;

    console.error = function(message){
      data = message;
    };
    callback();

    console.error = logFunction;
    return data;
  }

};