'use strict';

/*
 * array-unsort
 */

module.exports = {
    unsort: function(input) {
        _validate(input);
        return(_unsort(input, input.slice()));
    },
    unsortInplace: function(input) {
        _validate(input);
        return(_unsort(input, input));
    }
};

function _unsort(input, output) {
    var length = input.length;
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

function _validate(input) {
    if (!input) {
        throw new ReferenceError('Missing input argument');
    } else if (Array.isArray(input) === false) {
        throw new TypeError('Argument is not an array');
    }
}
