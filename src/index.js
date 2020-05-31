/* eslint-disable no-bitwise, no-param-reassign, no-plusplus, prefer-destructuring,
  no-console, padded-blocks, func-names, wrap-iife */

/**
 * array-unsort
 * Version: 1.1.0
 * Purpose: Unsorts (shuffles) an arbitrary array
 * Modes: In-place unsort, or new unsorted array
 * Algorithms:
 *   - Fisher-Yates
 *   - Modified Fisher-Yates (which guarantees that no array elements remain at the
 *     same index after shuffling)
 * Copyright: Bo Ericsson 2020
 */

(function (exports) {
  const version = '1.1.0';
  const FISHER_YATES = 'fisher-yates';
  const UNIQUE_IDX = 'unique-idx';

  // Generate array with each array element equal to it's index
  function range(length) {
    if (length < 1) {
      throw new Error(`Invalid array length: ${length}`);
    }

    const a = [];
    for (let i = 0; i < length; i++) {
      a.push(i);
    }
    return a;
  }

  // Unsort the output array either using Fisher-Yates or using modified Fisher-Yates, the latter
  // guarantees that no array element will remain in its original position after unsort
  function unsort(output, type) {
    const { length } = output;
    let swapIdx;
    let swapValue;

    // Short circuit for array length edge cases 0, 1 and 2
    switch (length) {
      case 0:
      case 1:
        // Just return the array of 0 or 1 elements
        return output;
      case 2:
        // Swap the two elements
        swapIdx = output[0];
        output[0] = output[1];
        output[1] = swapIdx;

        // Returned the shuffled array
        return output;
      default:
    }

    switch (type) {
      case FISHER_YATES: {
        // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
        for (let i = 0; i < length; i++) {
          // Determine the remaining length
          const currLength = length - i;

          // Determine the source position (the index of the array where the elem will be
          // swapped from)
          const sourceIdx = currLength - 1;

          // Determine the destination position
          const destIdx = ~~(Math.random() * currLength);

          // Swap the values at the source and destination positions
          swapValue = output[destIdx];
          output[destIdx] = output[sourceIdx];
          output[sourceIdx] = swapValue;
        }
        break;
      }
      case UNIQUE_IDX: {
        // Modified Fisher-Yates shuffle which ensures that all elements will move, that is,
        // no array element will retain its original position

        // Instead of swapping array values, we're here swapping array indexes
        const indexes = range(length).reverse();

        // Single pass through of the indexed array using Fischer-Yates
        for (let i = 0; i < length; i++) {
          // Determine the remaining length
          const currLength = length - i;

          // Compute source idx
          const sourceIdx = currLength - 1;

          // Generate random destination idx
          const destIdx = ~~(Math.random() * currLength);

          // Swap the indexes at the sourceIdx and destIdx
          swapIdx = indexes[destIdx];
          indexes[destIdx] = indexes[sourceIdx];
          indexes[sourceIdx] = swapIdx;
        }

        // Determine which indexes did not move during the shuffling process
        const badPos = [];
        const goodPos = [];
        indexes.forEach((d, i) => {
          if (d === i) {
            badPos.push(d);
          } else {
            goodPos.push(d);
          }
        });

        if (badPos.length === indexes.length) {
          // In this case all indexes remain in their original position...

          // Rotate the array left a random number of times
          const rotateCount = indexes.length === 3
            ? ~~(Math.random() * 2) + 1 // Special case for array length of 3
            : ~~(Math.random() * (indexes.length - 2)) + 1; // All other array lengths

          for (let i = 0; i < rotateCount; i++) {
            const idx = indexes.shift();
            indexes.push(idx);
          }
        } else {
          // In this case, some (but not all) values remain in the original position...

          // Here badPos array can contain up to (indexes.length - 2) indexes,
          // as it is logically impossible for (indexes.length -1) to exist as
          // that would imply that all but one element is in the original
          // position
          let idxA;
          let idxB;
          let posA;
          let posB;

          while (badPos.length > 0) {
            if (badPos.length === 1) {
              // Here we're swapping the single badPos element with a random
              // indexes element
              idxA = ~~(Math.random() * goodPos.length);
              posA = goodPos[idxA];
              posB = badPos.pop();
              swapValue = indexes[posA];
              indexes[posA] = indexes[posB];
              indexes[posB] = swapValue;

            } else {
              // Here we're swapping a random badPos element with another random
              // badPos element. The badPos array keeps shrinking until only
              // one element remains, which will be handled by the code just above
              idxA = ~~(Math.random() * badPos.length);
              posA = badPos.splice(idxA, 1)[0];
              idxB = ~~(Math.random() * badPos.length);
              posB = badPos.splice(idxB, 1)[0];
              indexes[posA] = posB;
              indexes[posB] = posA;
            }
          }
        }

        // Refill the output array using the random indexes just generated
        const tempOutput = output.slice();
        output.length = 0;
        indexes.forEach((d) => output.push(tempOutput[d]));
        break;
      }
      default:
        console.error(`Invalid algorithm type argument: ${type}`);
        return null;
    }

    // Return the shuffled array
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

  exports.unsort = (input, type = FISHER_YATES) => {
    validateArray(input);
    validateType(type);
    return unsort(input.slice(), type);
  };

  exports.unsortInplace = (input, type = FISHER_YATES) => {
    validateArray(input);
    validateType(type);
    return unsort(input, type);
  };

  exports.version = version;
})(typeof exports === 'undefined' ? this.unsort = {} : exports);
