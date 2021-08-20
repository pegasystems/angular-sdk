const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const md5 = require('md5-file');
const fse = require("fs-extra");
const replace = require("replace-in-file");


function CopyWebpackExternalsManifest(options) {
  this.externalsAssets = [];
  this.externals = {};
  this.chunksOrder = options.chunksOrder || ['manifest', 'vendor'];
  if (options.externals.length) {
    options.externals.forEach((item) => {
      // externals
      this.externals[item.module] = item.export;

      // get version
      // eslint-disable-next-line import/no-dynamic-require
      const { version } = require(`${item.module}/package.json`).version;

      this.externalsAssets.push(Object.assign(item, { version }));
    });
  }
}
// eslint-disable-next-line
CopyWebpackExternalsManifest.prototype.apply = function (compiler) {
  const _this = this;

  // assign webpack config externals
  compiler.options.externals =
    typeof compiler.options.externals === 'object'
      ? Object.assign(compiler.options.externals, _this.externals)
      : _this.externals;

  const copyAssets = [];
  const externalsManifest = [];
  if (_this.externalsAssets.length) {
    _this.externalsAssets.forEach((item) => {
      const fromDir = `node_modules/${item.module}/`;
      const toDir = `${compiler.options.output.path}/externals/`;
      const externalsDir = `${compiler.options.output.publicPath}`;

      const mdHash = md5.sync(fromDir + item.entry);
      const fileExt = item.entry.split('.').pop();
      // copy entry
      if (typeof item.entry === 'string') {
        copyAssets.push({
          from: fromDir + item.entry,
          to: toDir,
          transformPath() {
            return `${item.module}.${mdHash}.${fileExt}`;
          },
        });
        externalsManifest.push(`${item.module}.${mdHash}.${fileExt}`);
      } else if (Array.isArray(item.entry)) {
        item.entry.forEach((entry) => {
          copyAssets.push({
            from: fromDir + entry,
            to: toDir + entry,
          });
          externalsManifest[
            `${item.module}/${entry}`
          ] = `${externalsDir}${entry}`;
        });
      }

      // copy assets
      if (Array.isArray(item.assets)) {
        const subjectAssets = item.assets.map((entry) => ({
          from: fromDir + entry,
          to: toDir + entry,
        }));
        copyAssets.push(...subjectAssets);
      }
    });

    new CopyWebpackPlugin({ patterns: copyAssets }).apply(compiler);
  }

  // eslint-disable-next-line func-names
  compiler.hooks.done.tap('After Compilation', function (stats) {


    // check to see if you have errors in "stats", if so clip out other data
    // and show errors to console and don't continue
    let myStats = stats.toString();
    if (myStats.indexOf("ERROR") >= 0) {
        let myClippedStats = myStats.substring(myStats.indexOf('ERROR'));
        console.log("====> Errors");
        console.log(myClippedStats);
        return;
    }

    /* Start of compiler hooks */
    const distDir = `${compiler.options.output.path}`;

    const isDevMode = compiler.options.mode === 'development';
    let assetsChunks = stats.toJson().assetsByChunkName;
    const order = [
      'runtime',
      'polyfills',
      'styles',
      'vendor',
      'main',
    ];

    const entry = [];
    order.forEach((chunkName, i) => {
      if (isDevMode) {
        Array.prototype.push.apply(entry, assetsChunks[chunkName]);
      } else {
        if (assetsChunks[chunkName]) {
          entry.push(assetsChunks[chunkName]);
        }
      }
    });

    // for now, get the bootstrap-shell from src,
    // create a bootstrap-shell and bootstrap-shell-mashup

    const bootDest = path.join(`${distDir}`, "bootstrap-shell.js");
    const sdkDest = path.join(`${distDir}`, "sdk-config.json");

    //const bootMashupDest = path.join(`${distDir}`, "../bootstrap-shell-mashup.js");

    fse
      .copy(
        path.join(`${__dirname}`, "../constellation/bootstrap-shell.js"),
        `${bootDest}`
      )
      .then(() => {
        console.log("Successfully Added boostrap-shell");

      })
      .catch((err) => {
        console.error(err);
      });

      fse
      .copy(
        path.join(`${__dirname}`, "../sdk-config.json"),
        `${sdkDest}`
      )
      .then(() => {
        console.log("Successfully Added sdk-config");

      })
      .catch((err) => {
        console.error(err);
      });


  });


 


  
};

module.exports = CopyWebpackExternalsManifest;
