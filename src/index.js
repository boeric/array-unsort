/* eslint-disable no-bitwise, no-param-reassign, no-plusplus */

/**
 * array-unsort
 * Version: 1.0.0
 * Purpose: Unsorts (shuffles) an arbitrary array
 * By: Bo Ericsson (https://github.com/boeric)
 */

const { FISHER_YATES, UNIQUE_IDX } = require('./constants.js');

function unsort(output, type) {
  const { length } = output;
  const input = output.slice(0);

  // Edge case where the array is either empty or contains one element
  if (length <= 2) {
    return input;
  }

  if (type === UNIQUE_IDX) {
    // This shuffling guarantees that no array elem will maintain it's old array position.
    // Please note that this algorithm will place the first elem in the last position,
    // while all other array elems are placed randomly with no elem retaining it's original
    // array position
    for (let destIdx = 0; destIdx <= length - 2; destIdx++) {
      // Compute source position (the index of the array where the elem will be moved from)
      const sourceIdx = ~~(Math.random() * (length - destIdx - 1)) + destIdx + 1;

      // Obtain the array elem to be moved, and remove it from the array
      const movedValue = output.splice(sourceIdx, 1)[0];

      // Insert the moved elem at the destination position
      output.splice(destIdx, 0, movedValue);

      // Check if the array elem is in the same position as in the input array
      if (output[destIdx] === input[destIdx]) {
        // If so, swap the elem with the prior elem
        const swapValue = output[destIdx - 1];
        output[destIdx] = swapValue;
        output[destIdx - 1] = movedValue;
      }
    }
  } else {
    // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    for (let i = 0; i < length; i++) {
      // Determine the remaining length
      const currLength = length - i;

      // Determine the source position (the index of the array where the elem will be swapped from)
      const sourceIdx = currLength - 1;

      // Determine the desitination position
      const destIdx = ~~(Math.random() * currLength);

      // Swap the values at the source and destination positions
      const swapValue = output[destIdx];
      output[destIdx] = output[sourceIdx];
      output[sourceIdx] = swapValue;
    }
  }

  // Return the unsorted (shuffled) array
  return output;
}


function validateArray(input) {
  if (!input) {
    throw new ReferenceError('Missing input argument');
  } else if (Array.isArray(input) === false) {
    throw new TypeError('Argument is not an array');
  }
}

function validateType(type) {
  if (![UNIQUE_IDX, FISHER_YATES].includes(type)) {
    throw new ReferenceError(`Invalid type argument: ${type}`);
  }
}

module.exports = {
  unsort: (input, type = FISHER_YATES) => {
    validateArray(input);
    validateType(type);
    return unsort(input.slice(), type);
  },
  unsortInplace: (input, type = FISHER_YATES) => {
    validateArray(input);
    validateType(type);
    return unsort(input, type);
  },
};
