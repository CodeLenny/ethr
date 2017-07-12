function either(cb) {

  function fulfilled(...data) {
    return Promise.resolve(cb(true, ...data));
  }

  function rejected(err, ...data) {
    return Promise
      .resolve(cb(false, err, ...data))
      .then(() => { throw err; });
  }

  return [ fulfilled, rejected ];
}

module.exports = either;
