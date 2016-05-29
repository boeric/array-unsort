**array-unsort**


**Installation**

`npm install array-unsort`


**Usage**

```
var unsort = require("array-unsort").unsort;

var sorted = [];
for (var i = 0; i < 100; i++) {
  sorted.push(i);
}

var unsorted = unsort(sorted);
```

**Errors**

If no argument is passed, a ReferenceError is thrown. If passed argument is not an array, a TypeError is thrown
