'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');

// comment this code out, if you have an "ENOENT: no such file or directory" build error and re-build
// to see the real Angular errors, then uncomment onces fixed
module.exports = config => {
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './node_modules/@pega/auth/lib/oauth-client/authDone.html',
          to: './auth.html'
        },
        {
          from: './node_modules/@pega/auth/lib/oauth-client/authDone.js',
          to: './'
        }
      ]
    })
  );
  return config;
};
