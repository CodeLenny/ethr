const test = require("ava");
const either = require("either");
const { PreviousError, LatestError } = require("test/helpers/errors");

test("causes previously-fulfilling Promise to fail", t => {
  let p = Promise
    .resolve()
    .then(...either(() => Promise.reject(new LatestError())));

  return t.throws(p, LatestError);
});

test("replaces previous rejection", t => {
  let p = Promise
    .reject(new PreviousError())
    .then(...either(() => Promise.reject(new LatestError())));

  return t.throws(p, LatestError);
});
