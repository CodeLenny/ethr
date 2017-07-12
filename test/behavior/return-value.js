const test = require("ava");
const either = require("either");
const { PreviousError } = require("test/helpers/errors");

test("replaces previously resolved values", t => {
  return Promise
    .resolve(1)
    .then(...either(() => 2))
    .then(a => {
      t.is(a, 2);
    });
});

test("doesn't change previous errors", t => {
  let p = Promise
    .reject(new PreviousError())
    .then(...either(() => 2));

  return t.throws(p, PreviousError);
});
