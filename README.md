# Either: Promise.finally for ES6
[![npm](https://img.shields.io/npm/v/ethr.svg)](https://www.npmjs.com/package/ethr)
[![Build Status](https://travis-ci.org/CodeLenny/ethr.svg?branch=master)](https://travis-ci.org/CodeLenny/ethr)
[![Codecov](https://img.shields.io/codecov/c/gh/CodeLenny/ethr.svg)](https://codecov.io/gh/CodeLenny/ethr)
![NodeJS Version](http://img.shields.io/node/v/ethr.svg)

A modified version of [Bluebird][]'s [Promise.finally][] designed to fit into existing code.

Instead of modifying the entire [Promise][] chain to add a `.finally()` method, `Either` takes advantage of the both
callbacks supported by [Promise#then][] to easily set both a success clause and a failure clause.

```js
const either = require("ethr");

Promise
  .reject()
  .then(...either(() => {
    console.log("This will run.");
  }));
```

`Either` returns two callbacks: one to handle fulfilled promises, and one to handle rejected promises.
ES6 [Spread syntax][] (supported in [Node 5.12.0+][spread-node-support] and most [modern browsers][spread-web-support])
can be used to quickly unpack these into the two sides of [Promise#then][], but is not required.

Once the Promise chain has gotten to `Either`, the callback passed to `either()` will always be called with the current
state (`true` if promise is fulfilling, `false` if promise is rejected).

In general, the returned value from the callback is inserted into the Promise chain.

- If any errors are thrown, or the callback returns a rejecting Promise, the error is passed along to the next Promise
  handler.
- If the callback chain was previously rejecting and the callback returns a normal value or a fulfilling Promise, then
  the previous error will be re-thrown for the next Promise handler.
- If the chain was previously resolved, then any returned value or resolved value from the callback will be passed on to
  the chain.

See the [tests](test/behavor/) for specific examples.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promise#then]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
[Spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
[spread-node-support]: http://node.green/#ES2015-syntax-spread-------operator-with-arrays--in-function-calls
[spread-web-support]: http://kangax.github.io/compat-table/es6/#test-spread_(...)_operator
[Bluebird]: http://bluebirdjs.com/
[Promise.finally]: http://bluebirdjs.com/docs/api/finally.html
