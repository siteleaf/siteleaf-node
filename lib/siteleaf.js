var rp = require("request-promise");
var merge = require("merge");
var request;

function Siteleaf(options) {
  this.options = options || {};
  this.options = merge({
    apiKey: process.env['SITELEAF_APIKEY'],
    apiSecret: process.env['SITELEAF_APISECRET']
  }, this.options);

  request = rp.defaults({
    baseUrl: "https://api.v2.siteleaf.com/v2/",
    auth: {
      user: this.options.apiKey,
      pass: this.options.apiSecret
    },
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Siteleaf-Node/0.1.0'
    },
    json: true
  });
};

Siteleaf.prototype.request = function(uri, options){
  options = options || {};
  options = merge(options, { uri: uri });

  return request(options).catch((err) => {
    this.onerror(err)
  });
};

Siteleaf.prototype.onerror = function(err) {
  console.error(err.response.body);
};

module.exports = Siteleaf;