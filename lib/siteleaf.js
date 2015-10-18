var https = require('https');
var OPTS = {
    hostname: 'api.v2.siteleaf.com',
    prefix: '/v2/',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Siteleaf-Node/0.1.0'
    }
};

function Siteleaf(options) {
  /**
   * Options object
   * @public  */
  this.options = options || {};

  if (this.options.apiKey === null)
    this.options.apiKey = process.env['SITELEAF_APIKEY'];

  if (this.options.apiSecret === null)
    this.options.apiSecret = process.env['SITELEAF_APISECRET'];
};

Siteleaf.prototype.call = function(uri, options){
  if(!options)
    options = {};

  if (!options.params)
    options.params = {};

  if(!options.method)
    options.method = 'GET';

  options.params = new Buffer(JSON.stringify(options.params), 'utf8');
  OPTS.path = OPTS.prefix + uri;
  OPTS.headers['Content-Length'] = options.params.length;
  OPTS.auth = this.options.apiKey + ':' + this.options.apiSecret;
  OPTS.method = options.method;

  var req = https.request(OPTS, (res) => {
    var json = '';
    res.setEncoding('utf8');

    res.on('data', (data) => {
      return json += data;
    });

    res.on('end', () => {
      try {
        json = JSON.parse(json);
      } catch (err) {
        json = {
          type: 'error',
          message: err
        };
      }

      if (json == null) {
        json = {
          type: 'error',
          message: 'An unexpected error occurred'
        };
      }

      if (res.statusCode !== 200) {
        if (options.onerror) {
          return options.onerror(json);
        } else {
          return this.onerror(json);
        }
      } else {
        if (options.onresult) {
          return options.onresult(json);
        }
      }
    });
  });

  req.write(options.params);
  req.end();

  req.on('error', (err) => {
    if (options.onerror){
      options.onerror(err);
    } else {
      this.onerror({
        type: 'error',
        message: err
      });
    }
  });
};

Siteleaf.prototype.onerror = function(err) {
  throw {
    type: err.type,
    message: err.message,
    toString: function() {
      return "" + err.type + ": " + err.message;
    }
  };
};

module.exports = Siteleaf;