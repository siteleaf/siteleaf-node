var rp = require("request-promise");
var merge = require("merge");
var request;

class Siteleaf {
  constructor(options = {}) {
    this.options = {
      apiKey: process.env['SITELEAF_APIKEY'],
      apiSecret: process.env['SITELEAF_APISECRET'],
      ...options
    };

    this.baseUrl = "https://api.siteleaf.com/v2/";
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Siteleaf-Node/0.1.0'
    };
  }

  async request(uri, options = {}) {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        ...this.headers,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      auth: {
        user: this.options.apiKey,
        pass: this.options.apiSecret
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}${uri}`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      this.onerror(err);
    }
  }

  onerror(err) {
    console.error(err.message);
  }
}

module.exports = Siteleaf;
