"use strict";

/*
 * array-unsort
 */


module.exports = {

  unsort: function(input, inPlace) {

    validateInput(input);
    return(_unsort(input, inPlace ? true : false));

  },

  unsortInplace: function(input) {

    validateInput(input);
    return(_unsort(input, true));

  }

}


function _unsort(input, inPlace) {

  var length = input.length;
  var output = inPlace ? input : input.slice();
  var currSize;
  var swapIdx;
  var idx;
  var item;

  // Fisher-Yates shuffle
  for (var i = 0; i < length; i++) {

    currSize = length - i;
    swapIdx = currSize - 1;
    idx = ~~(Math.random() * currSize);
    item = output[idx];
    output[idx] = output[swapIdx];
    output[swapIdx] = item;

  }

  return output;

}


function validateInput(input) {

  if (!input) {
    throw new ReferenceError('Missing input argument');
  }

  if (Array.isArray(input) === false) {
    throw new TypeError('Argument is not an array')
  }

}
