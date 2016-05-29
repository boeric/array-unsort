"use strict";

/* 
 * array-unsort
 */

var d3 = require("d3");

module.exports = {

  unsort: function(input) {

    if (!input) {
      throw new ReferenceError('Missing input argument');
    }

    if (Array.isArray(input) === false) {
      throw new TypeError('Argument is not an array') 
    }

    var copy = input.slice();
    var unsorted = d3.range(input.length).map(function(d) {
      return copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
    })

    return unsorted;
  }

}
