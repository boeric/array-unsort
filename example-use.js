/* eslint-disable no-bitwise, no-console, no-param-reassign, no-plusplus */

const { unsort, unsortInplace } = require('./src/index.js');

// Inputs
const input1 = [0, 1, 2, 3];
const input2 = ['z', 'a', 'b'];
const input3 = [-1, 10, 3, 5, 100];

// Examples Fisher-Yates
const unsorted1 = unsort(input1, 'fisher-yates');
console.log('unsorted1', unsorted1); // eg [ 0, 3, 2, 4 ]

const unsorted2 = unsort(input2, 'fisher-yates');
console.log('unsorted2', unsorted2); // eg [ 'b', 'a', 'z' ]

// Example modified Fisher-Yates that guarantees that no element remain
// in the same position after shuffling
const unsortedUnique1 = unsort(input1, 'unique-idx');
console.log('unsortedUnique1', unsortedUnique1); // eg: [ 4, 3, 0, 2 ]

const unsortedUnique2 = unsort(input2, 'unique-idx');
console.log('unsortedUnique2', unsortedUnique2); // eg: [ 'b', 'z', 'a' ]

const outputA = unsort(input3);
console.log(outputA === input3);

const outputB = unsortInplace(input3);
console.log(outputB === input3);

const length = 1000000;
const array = new Array(1000000).fill(null).map((d, i) => i);

let now = Date.now();
unsort(array, 'fisher-yates');
const ts0 = Date.now() - now;
console.log(`1 million elements suffled but some may remain at original index: ${ts0}ms`);

now = Date.now();
unsort(array, 'unique-idx');
const ts1 = Date.now() - now;
console.log(`All 1 million elements shuffled and in new positions): ${ts1}ms`);
