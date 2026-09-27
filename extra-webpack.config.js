'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');

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
