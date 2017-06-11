# array-unsort

**Installation**

`npm install array-unsort --save`

## Unsort/shuffle an arbitrary array

array-unsort.**unsort**(array)

array-unsort.**unsortInplace**(array)

The **unsort** method unsorts (shuffles) and returns a copy of the input array. The **unsortInplace** method unsorts the input array in-place. The module uses the **Fisher-Yates** algorithm.

### Example

```
var unsort = require("array-unsort").unsort;
var unsortInplace = require("array-unsort").unsortInplace;


// 1. Obtain an unsorted (shuffled) version of the input array
var sorted = [];
for (var i = 0; i < 100; i++) { sorted.push(i) }

var unsorted = unsort(sorted);

console.log("New unsorted array: " + (unsorted != sorted)); // = true


// 2. In-place unsort (input array shuffled in place)
var sorted = [];
for (var i = 0; i < 100; i++) { sorted.push(i) }

var unsorted = unsortInplace(sorted);
// or equivalently: var unsorted = unsort(sorted, true);

console.log("In-place unsort: " + (unsorted === sorted)); // = true

```

### Test

```
npm run test

```

### Errors

If **no** array is passed, a **ReferenceError** is thrown.

If the passed argument is **not an array**, a **TypeError** is thrown
