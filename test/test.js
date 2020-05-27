/* eslint-disable no-plusplus, no-nested-ternary, no-multi-spaces, key-spacing */
/* global assert, before, describe, expect, it */

const { FISHER_YATES, UNIQUE_IDX } = require('../src/constants.js');
const { unsort, unsortInplace } = require('../src/index.js');

function range(length) {
  if (length < 1) {
    throw new Error(`Invalid array length: ${length}`);
  }

  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
}

describe('Output consistency', () => {
  describe('Array length', () => {
    const input = range(10);
    let result;

    before(() => {
      result = unsort(input, FISHER_YATES);
    });

    it('should return an array of the same size', () => {
      expect(result.length).equal(input.length);
    });
  });

  describe('Empty input array', () => {
    let result;

    before(() => {
      result = unsort([]);
    });

    it('should return an empty array', () => {
      expect(result.length).equal(0);
    });
  });

  describe('One element array', () => {
    let result;

    before(() => {
      result = unsort([10]);
    });

    it('should return a one element array', () => {
      expect(result.length).equal(1);
    });

    it('should return the correct value', () => {
      expect(result[0]).equal(10);
    });
  });

  describe('Array elements', () => {
    const input = range(100);
    let result;

    before(() => {
      result = unsort(input);
    });

    function verifyItems(_) {
      const map = {};

      _.forEach((d) => {
        if (map[d] === undefined) map[d] = 0;
        map[d]++;
      });

      return Object.keys(map).every((d) => map[+d] === 1);
    }

    it('should return an array with all input items', () => {
      assert.strictEqual(true, verifyItems(result));
    });
  });
});

describe('In-place vs. not in-place unsort', () => {
  describe('In-place unsort', () => {
    const input = range(10);
    let result;

    before(() => {
      result = unsortInplace(input);
    });

    function validateEqual(a, b) {
      return a === b;
    }

    it('should unsort the array in-place (should not create new array object', () => {
      assert.deepEqual(true, validateEqual(input, result));
    });
  });

  describe('Not in-place unsort', () => {
    const input = range(10);
    let result;

    before(() => {
      result = unsort(input);
    });

    function validateNotEqual(a, b) {
      return a !== b;
    }

    it('should unsort the array not in-place (should create new array object)', () => {
      assert.deepEqual(true, validateNotEqual(input, result));
    });
  });
});

describe('Algorithm', () => {
  describe('Uniform distribution of unsorted array (Fisher-Yates)', () => {
    function validateRandom() {
      const iterations = 10000;
      const length = 10;
      const map = {};
      // To test for true randomness is complicated (https://en.wikipedia.org/wiki/Diehard_tests)
      // Can't do that here, so we're using something very simplified
      const tolerance = 0.03;

      // Init map
      range(length).forEach((i) => {
        const obj = {};
        range(length).forEach((j) => {
          obj[`pos${j}`] = 0;
        });
        map[`index${i}`] = obj;
      });

      // Iterate and update map
      range(iterations).forEach(() => {
        const arr = range(length);
        unsortInplace(arr, FISHER_YATES);
        arr.forEach((i, j) => {
          map[`index${i}`][`pos${j}`]++;
        });
      });

      // Process map and determine the array elems with highest (max) and lowest (min) frequency
      let freqMax = -Infinity;
      let freqMin = Infinity;
      Object.keys(map).forEach((key) => {
        Object.keys(map[key]).forEach((pos) => {
          const count = map[key][pos];
          const freq = count / iterations;
          freqMin = (freq < freqMin) ? freq : freqMin;
          freqMax = (freq > freqMax) ? freq : freqMax;
        });
      });

      // With an array length of x, the count of each bin should approach 1 / x for a random
      // distribution as the iteration count increases

      // Test whether the frequency range is within the tolerance
      const diff = Math.abs(freqMax - freqMin);
      if (diff > tolerance) {
        return false;
      }

      return true;
    }

    it('should generate random output index for each input index', () => {
      assert.deepEqual(true, validateRandom());
    });
  });

  describe('Ensure random distribution with no array element in its original position (modified Fisher-Yates)', () => {
    function validateUniqueIdx(iterations, length, tolerance) {
      const map = {};

      // Init map
      range(length).forEach((i) => {
        const obj = {};
        range(length).forEach((j) => {
          obj[`pos${j}`] = 0;
        });
        map[`index${i}`] = obj;
      });

      // Iterate and update map
      range(iterations).forEach(() => {
        const arr = range(length);
        unsortInplace(arr, UNIQUE_IDX);
        arr.forEach((i, j) => {
          map[`index${i}`][`pos${j}`]++;
        });
      });

      // Inspect map to verify that no element remains in it's original position
      let idx = 0;
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in map) {
        if (map[key][`pos${idx}`] !== 0) {
          return false;
        }
        idx++;
      }

      // Process map and determine the array elems with highest (max) and lowest (min) frequency
      let freqMax = -Infinity;
      let freqMin = Infinity;
      Object.keys(map).forEach((key, i) => {
        Object.keys(map[key]).forEach((pos, j) => {
          if (i !== j) {
            const count = map[key][pos];
            const freq = count / iterations;
            freqMin = (freq < freqMin) ? freq : freqMin;
            freqMax = (freq > freqMax) ? freq : freqMax;
          }
        });
      });

      // With an array length of x, the count of each bin should approach 1 / (x - 1) for a
      // random distribution as the iteration count increases

      // Test whether the frequency range is within the tolerance
      const diff = Math.abs(freqMax - freqMin);
      if (diff > tolerance) {
        return false;
      }

      return true;
    }

    function getDescription(iterations, length, tolerance) {
      const str = 'should produce correct result';
      return `${str} (iterations: ${iterations}, length: ${length}, tolerance: ${tolerance})`;
    }

    function executeTest(iterations, length, tolerance, description) {
      it(description, () => {
        assert.deepEqual(true, validateUniqueIdx(iterations, length, tolerance));
      });
    }

    // Define tests
    const tests = [
      { iterations:     1, length:  2, tolerance: 0.000 },
      { iterations: 10000, length:  3, tolerance: 0.015 },
      { iterations: 10000, length:  4, tolerance: 0.060 }, // Algoritmic anomaly here
      { iterations: 10000, length:  5, tolerance: 0.030 },
      { iterations: 10000, length:  6, tolerance: 0.030 },
      { iterations: 10000, length:  7, tolerance: 0.030 },
      { iterations: 10000, length:  8, tolerance: 0.030 },
      { iterations: 10000, length: 10, tolerance: 0.030 },
      { iterations: 10000, length: 20, tolerance: 0.030 },
    ];

    // Run the tests
    tests.forEach((d) => {
      const { iterations, length, tolerance } = d;
      const description = getDescription(iterations, length, tolerance);
      executeTest(iterations, length, tolerance, description);
    });
  });
});
