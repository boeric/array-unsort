/* eslint-disable no-bitwise, no-param-reassign, no-plusplus, prefer-destructuring,
  no-console, padded-blocks, func-names, wrap-iife */

/**
 * array-unsort
 * Version: 1.0.2
 * Purpose: Unsorts (shuffles) an arbitrary array
 * Modes: In-place unsort, or new unsorted array
 * Algorithms:
 *   - Fisher-Yates
 *   - Modified Fisher-Yates (which guarantees that no array elements remain at the
 *     same index after shuffling)
 * Copyright: Bo Ericsson 2020
 */

(function (exports) {
  const version = '1.0.2';
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

    // Deal with edge cases
    switch (length) {
      case 0:
      case 1:
        return output;
      case 2:
        swapIdx = output[0];
        output[0] = output[1];
        output[1] = swapIdx;
        return output;
      default:
    }

    if (type === FISHER_YATES) {
      // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
      for (let i = 0; i < length; i++) {
        // Determine the remaining length
        const currLength = length - i;

        // Determine the source position (the index of the array where the elem will be
        // swapped from)
        const sourceIdx = currLength - 1;

        // Determine the destination position
        const destIdx = ~~(Math.random() * currLength);
        // console.log('&&', i, sourceIdx, destIdx)

        // Swap the values at the source and destination positions
        swapValue = output[destIdx];
        output[destIdx] = output[sourceIdx];
        output[sourceIdx] = swapValue;
      }
    } else if (type === UNIQUE_IDX) {
      // Modified Fisher-Yates shuffle
      const indexes = range(length).reverse();

      // Single pass through the indexed array using Fischer-Yates
      for (let i = 0; i < length; i++) {
        // Determine the remaining length
        const currLength = length - i;

        // Compute source
        const sourceIdx = currLength - 1;

        // Generate random destination
        const destIdx = ~~(Math.random() * currLength);

        // Swap the indexes at the source and destination
        swapIdx = indexes[destIdx];
        indexes[destIdx] = indexes[sourceIdx];
        indexes[sourceIdx] = swapIdx;
      }

      // Determine which indexes did not move during the shuffling process
      const invalidPositions = [];
      indexes.forEach((d, i) => {
        if (d === i) {
          invalidPositions.push(d);
        }
      });

      // Grab the last value from the invalid array, if the array has odd length
      const single = invalidPositions.length % 2 === 1
        ? invalidPositions.pop()
        : undefined;

      // Generate pairs of remaining invalid indexes
      const pairs = [];
      for (let i = 0; i < invalidPositions.length - 1; i += 2) {
        pairs.push([invalidPositions[i], invalidPositions[i + 1]]);
      }

      // Swap the indexes of each pair
      pairs.forEach((pair) => {
        const [a, b] = pair;
        indexes[a] = b;
        indexes[b] = a;
      });

      // Process the single invalid index
      if (single !== undefined) {
        // Generate a random index to use for swapping the single invalid index
        swapIdx = ~~(Math.random() * (indexes.length - 1)) + single + 1;
        swapIdx %= indexes.length;

        indexes[single] = indexes[swapIdx];
        indexes[swapIdx] = single;
      }

      // Refill the output array using the random indexes just generated
      const tempOutput = output.slice();
      output.length = 0;
      indexes.forEach((d) => output.push(tempOutput[d]));
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
