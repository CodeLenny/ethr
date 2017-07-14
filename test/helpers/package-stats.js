/**
 * Collects statistics about the published package via cost-of-modules.herokuapp.com and updates a Bitly link to capture
 * the current state of the package.
*/

const request = require("request-promise");
const { name, version } = require("../../package.json");

const key = process.env.REBRANDLY_KEY || require(`${process.env.HOME}/.rebrandly`).key;
if(typeof key !== "string" || key.length < 5) {
  console.error("Unable to find a Rebrandly api key.  Please set REBRANDLY_KEY or create '~/.rebrandly.[js|json]'");
  process.exit(1);
}

function updateLink(linkID, url) {
  return request({
    method: "GET",
    uri: `https://api.rebrandly.com/v1/links/${linkID}`,
    json: true,
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
    },
  })
  .then(details => {
    details.destination = url;
    return request({
      method: "POST",
      uri: `https://api.rebrandly.com/v1/links/${linkID}`,
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
      },
    });
  });
}

query = {
  method: "GET",
  uri: `https://cost-of-modules.herokuapp.com/package?name=${name}&record=true`,
  json: true,
};

request(query)
  .then(res => {
    if(res.version !== version) { throw new Error(`Expected version ${version}.  Got ${res.version}.`); }
    return Promise.all([
      updateLink("3210040", `https://img.shields.io/badge/dependencies-${res.dependencies}-brightgreen.svg`),
      updateLink("3210300", `https://img.shields.io/badge/devDependencies-${res.dependencies}-brightgreen.svg`),
      updateLink("3210336", `https://img.shields.io/badge/minified%20size-${res.size}b-brightgreen.svg`),
      updateLink("3210372", `https://img.shields.io/badge/gzip%20size-${res.gzipSize}b-brightgreen.svg`),
    ]);
  })
  .catch(err => {
    console.error(err.stack || err);
    process.exit(1);
  })
