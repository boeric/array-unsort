"use strict";

/*
 * array-unsort
 */

var d3 = require("d3");

module.exports = {

  unsort: function(input) {

    validateInput(input);

    var copy = input.slice();
    var unsorted = d3.range(input.length).map(function(d) {
      return copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
    })

    return unsorted;
  },

  unsortFisherYates: function(input) {

    validateInput(input);

    var length = input.length;
    var copy = input.slice();

    for (var i = 0; i < length; i++) {
      var currSize = length - i;
      var swapIdx = currSize - 1;

      // get random index
      var idx = ~~(Math.random() * currSize);

      // get the items at index and swap index
      var item = copy[idx];
      var swapItem = copy[swapIdx];

      // swap the items
      copy[idx] = swapItem;
      copy[swapIdx] = item;
    }

    return copy;
  }

}


function validateInput(input) {

  if (!input) {
    throw new ReferenceError('Missing input argument');
  }

  if (Array.isArray(input) === false) {
    throw new TypeError('Argument is not an array')
  }

}
