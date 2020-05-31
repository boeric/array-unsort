## Unsort/shuffle an arbitrary array

The **`unsort`** method unsorts (shuffles) and returns a copy of the input array.

The **`unsortInplace`** method unsorts the input array in-place.

Two algorithms are available:
- **Fisher-Yates**
- **Modified Fisher-Yates**, which guarantees that no array element remain at the same index after shuffling


**Fisher-Yates Usage**

`unsort(array);` or equivalently `unsort(array, 'fisher-yates);`


**Modified Fisher-Yates Usage**

`unsort(array, 'unique-idx');`

### Demo

The module is alive [here](https://bl.ocks.org/boeric/35eec347e240c6e41ebe04d85e28de9d). The gist is [here](https://gist.github.com/boeric/35eec347e240c6e41ebe04d85e28de9d)


### Installation

`npm install array-unsort --save`

### Examples

```
const { unsort, unsortInplace } = require("array-unsort");

// Inputs
const input1 = [0, 1, 2, 3];
const input2 = ['z', 'a', 'b'];
const input3 = [-1, 10, 3, 5, 100];

// Example 1: Fisher-Yates

const unsorted1 = unsort(input1, 'fisher-yates');
console.log('unsorted1', unsorted1); // eg [ 0, 1, 3, 2 ]

const unsorted2 = unsort(input2, 'fisher-yates');
console.log('unsorted2', unsorted2); // eg [ 'b', 'a', 'z' ]

// Example 2: Modified Fisher-Yates that guarantees that all elements are at
// new indexes after shuffling

const unsortedUnique1 = unsort(input1, 'unique-idx');
console.log('unsortedUnique1', unsortedUnique1); // eg: [ 2, 3, 1, 0 ]

const unsortedUnique2 = unsort(input2, 'unique-idx');
console.log('unsortedUnique2', unsortedUnique2); // eg: [ 'b', 'z', 'a' ]

// Example 3: New array vs in-place

const outputA = unsort(input3); // Defaults to 'fisher-yates'
console.log(outputA === input3); // false

const outputB = unsortInplace(input3); // Defaults to 'fisher-yates'
console.log(outputB === input3); // true
```

### Performance
```
const array = new Array(1000000).fill(null).map((d, i) => i);

let now = Date.now();
unsort(array, 'fisher-yates');
const ts0 = Date.now() - now;
console.log(`1 million elements suffled but some may remain at original index: ${ts0}ms`); // 146 ms

now = Date.now();
unsort(array, 'unique-idx');
const ts1 = Date.now() - now;
console.log(`All 1 million elements shuffled and at new indexes): ${ts1}ms`); // 272ms
```

### Test

```
npm run test
```

### Errors

If **no** array is passed, a **ReferenceError** is thrown.

If the passed argument is **not an array**, a **TypeError** is thrown

### Please note

If an array with the length of zero or one, the array is returned
