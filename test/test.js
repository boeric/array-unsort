/* eslint-disable no-plusplus, no-nested-ternary */
/* global assert, before, describe, expect, it */

const { unsort, unsortInplace } = require('../src/index.js');

let input;
let result;

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
    input = range(10);

    before(() => {
      result = unsort(input);
    });

    it('should return an array of the same size', () => {
      expect(result.length).equal(input.length);
    });
  });

  describe('Empty input array', () => {
    before(() => {
      result = unsort([]);
    });

    it('should return an empty array', () => {
      expect(result.length).equal(0);
    });
  });

  describe('One element array', () => {
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
    input = range(100);

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
    input = range(10);

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
    input = range(10);

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
  describe('Probability distribution of sorted indexes (400K unsort iterations), fisher-yates', () => {
    function validateRandom() {
      const iterations = 400000;
      const length = 5;
      const map = {};
      const threshold = 0.002;

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
        unsortInplace(arr, 'fisher-yates');
        arr.forEach((i, j) => {
          map[`index${i}`][`pos${j}`]++;
        });
      });

      // Done iterating, now inspect map
      let max = -Infinity;
      let min = Infinity;
      Object.keys(map).forEach((key) => {
        Object.keys(map[key]).forEach((pos) => {
          const value = map[key][pos];
          const pct = value / iterations;
          if (pct < min) min = pct;
          if (pct > max) max = pct;
        });
      });

      const expected = 1 / length;
      const maxDiff = max - expected;
      const minDiff = expected - min;
      return maxDiff < threshold || minDiff < threshold || false;
    }

    it('should generate random output index for each input index', () => {
      assert.deepEqual(true, validateRandom());
    });
  });

  describe('Ensure unique positions (400K unsort iterations)', () => {
    function validateUniqueIdx() {
      const iterations = 400000;
      const length = 5;
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
        unsortInplace(arr, 'unique-idx');
        arr.forEach((i, j) => {
          map[`index${i}`][`pos${j}`]++;
        });
      });

      // Done iterating, now inspect map
      let idx = 0;
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in map) {
        if (map[key][`pos${idx}`] !== 0) {
          return false;
        }
        idx++;
      }

      return true;
    }

    it('should unsort the array and ensure that no value remain in the same position', () => {
      assert.deepEqual(true, validateUniqueIdx());
    });
  });
});
