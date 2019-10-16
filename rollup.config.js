'use strict'

module.exports = {

  input: 'client/index.js',

  output: [{
    file: 'gameguardclient.js',
    format: 'esm'
  }, {
    file: 'client/test/gameguardclient.js',
    format: 'esm'
  }]

};