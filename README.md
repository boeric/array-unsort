##array-unsort##

**Installation**

`npm install array-unsort`

###Unsort/shuffle###

array-unsort.**unsort**(array)

The **unsort** method unsorts (shuffles) the passed array reference.

**Example**

```
var unsort = require("array-unsort").unsort;

var sorted = [];
for (var i = 0; i < 100; i++) {
  sorted.push(i);
}

var unsorted = unsort(sorted);
```

**Errors**

If **no** array is passed, a **ReferenceError** is thrown. If the passed argument is **not an array**, a **TypeError** is thrown
