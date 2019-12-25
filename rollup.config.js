'use strict'

module.exports = {
  input: 'client/index.js',

  /**
   * Create the following bundle files:
   * 
   * - client
   *  - gameguardclient.js in the general repository for use in apps.
   *  - tests/client/gameguardclient.js in the test folder for use by the client tests because it can be tricky using a file outside of the test directory.
   */
  output: [{
    file: 'gameguardclient.js',
    format: 'esm'
  }, {
    file: 'tests/client/gameguardclient.js',
    format: 'esm'
  }]

};