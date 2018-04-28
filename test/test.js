"use strict";
/* global describe, before, it, expect */

var unsort = require("../src/index.js").unsort;
var unsortInplace = require("../src/index.js").unsortInplace;
var d3 = require("d3");

var input;
var result;


describe("Output consistency", function() {

  describe("Array length", function() {
    input = d3.range(10);

    before(function() {
      result = unsort(input);
    });

    it("should return an array of the same size", function() {
      expect(result.length).equal(input.length);
    });

  });

  describe("Empty input array", function() {

    before(function() {
      result = unsort([]);
    });

    it("should return an empty array", function() {
      expect(result.length).equal(0);
    });

  });

  describe("One element array", function() {

    before(function() {
      result = unsort([10]);
    });

    it("should return a one element array", function() {
      expect(result.length).equal(1);
    });

    it("should return the correct value", function() {
      expect(result[0]).equal(10);
    });

  });

  describe("Array elements", function() {
    input = d3.range(1000);

    before(function() {
      result = unsort(input);
    });

    function verifyItems(_) {
      var map = {};

      _.forEach(function(d) {
        if (map[d] == undefined) map[d] = 0;
        map[d]++;
      });

      return Object.keys(map).every(function(d, i) {
        return map[+d] === 1;
      });
    }

    it("should return an array with all input items", function() {
      assert.strictEqual(true, verifyItems(result));
    });

  });

});


describe("In-place vs. not in-place unsort", function() {

  describe("In-place unsort", function() {
    input = d3.range(1000);

    before(function() {
      result = unsortInplace(input);
    });

    function validateEqual(_1, _2) {
      return _1 === _2;
    }

    it("should unsort the array in-place (should not create new array object", function() {
      assert.deepEqual(true, validateEqual(input, result));
    });

  });

  describe("Not in-place unsort", function() {
    input = d3.range(1000);

    before(function() {
      result = unsort(input);
    });

    function validateNotEqual(_1, _2) {
      return _1 != _2;
    }

    it("should unsort the array not in-place (should create new array object)", function() {
      assert.deepEqual(true, validateNotEqual(input, result));
    });

  });

});


describe("Algorithm", function() {

  describe("Probability distribution of sorted indexes (500K unsort iterations)", function() {

    function validateRandom() {

      var iterations = 400000;
      var length = 5;
      var map = {};
      var threshold = 0.002;

      // init map
      d3.range(length).forEach(function(i) {
        var obj = {};
        d3.range(length).forEach(function(j) {
          obj["pos" + j] = 0;
        });
        map["index" + i] = obj;
      });

      // iterate and update map
      d3.range(iterations).forEach(function() {
        var arr = d3.range(length);
        unsortInplace(arr);
        arr.forEach(function(i, j) {
          map["index" + i]["pos" + j]++;
        });
      });

      // done iterating, now inspect map
      var max = -Infinity;
      var min = Infinity;
      Object.keys(map).forEach(function(key) {
        Object.keys(map[key]).forEach(function(pos) {
          var value = map[key][pos];
          var pct = value / iterations;
          if (pct < min) min = pct;
          if (pct > max) max = pct;
        });
      });

      var expected = 1 / length;
      var maxDiff = max - expected;
      var minDiff = expected - min;

      return maxDiff < threshold ? true : minDiff < threshold ? true : false;
    }

    it ("should generate random output index for each input index", function() {
      assert.deepEqual(true, validateRandom());
    });

  });

});
