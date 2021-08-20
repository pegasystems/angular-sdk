const path = require("path");


const EXT_RUNTIME = "runtime-es5.js";
const EXT_POLYFILLS = "polyfills-es5.js";
const EXT_STYLES = "styles-es5.js";
const EXT_VENDOR = "vendor-es5.js";
const EXT_MAIN = "main-es5.js";


const externalLibsDistFile = {};
const distPath = path.resolve(__dirname, "./../dist/");
const iconPath = path.resolve(__dirname, "./../dist/icons/");

const cosmosDist = path.resolve(
  __dirname,
  "./../node_modules/pega-cosmos/index.js"
);

const isWatchEnable = process.env.WITH_WATCH === "true";
const isDevelopmentEnv = process.env.NODE_ENV === "development";

const reactBuildType = isDevelopmentEnv ? "development" : "production.min";

const cpObj = {
  patterns: [
 
    /* copying libs from node modules to dist */


    {
      from: path.resolve(
        __dirname,
        `./../dist/runtime-es5.js`
      ),
      to: distPath,
      transformPath() {
        const hash = require("md5-file").sync(
          path.resolve(
            __dirname,
            `./../dist/runtime-es5.js`
          )
        );
        externalLibsDistFile[EXT_RUNTIME] = isWatchEnable
          ? `runtime-es5.js`
          : `runtime-es5.${hash}.js`;
        return externalLibsDistFile[EXT_RUNTIME];
      }
    },
    {
      from: path.resolve(
        __dirname,
        `./../dist/polyfills-es5.js`
      ),
      to: distPath,
      transformPath() {
        const hash = require("md5-file").sync(
          path.resolve(
            __dirname,
            `./../dist/polyfills-es5.js`
          )
        );
        externalLibsDistFile[EXT_POLYFILLS] = isWatchEnable
          ? `polyfills-es5.js`
          : `polyfills-es5.${hash}.js`;
        return externalLibsDistFile[EXT_POLYFILLS];
      }
    },
    {
      from: path.resolve(
        __dirname,
        `./../dist/styles-es5.js`
      ),
      to: distPath,
      transformPath() {
        const hash = require("md5-file").sync(
          path.resolve(
            __dirname,
            `./../dist/styles-es5.js`
          )
        );
        externalLibsDistFile[EXT_STYLES] = isWatchEnable
          ? `styles-es5.js`
          : `styles-es5.${hash}.js`;
        return externalLibsDistFile[EXT_STYLES];
      }
    },
    {
      from: path.resolve(
        __dirname,
        `./../dist/vendor-es5.js`
      ),
      to: distPath,
      transformPath() {
        const hash = require("md5-file").sync(
          path.resolve(
            __dirname,
            `./../dist/vendor-es5.js`
          )
        );
        externalLibsDistFile[EXT_VENDOR] = isWatchEnable
          ? `vendor-es5.js`
          : `vendor-es5.${hash}.js`;
        return externalLibsDistFile[EXT_VENDOR];
      }
    },
    {
      from: path.resolve(
        __dirname,
        `./../dist/main-es5.js`
      ),
      to: distPath,
      transformPath() {
        const hash = require("md5-file").sync(
          path.resolve(
            __dirname,
            `./../dist/main-es5.js`
          )
        );
        externalLibsDistFile[EXT_MAIN] = isWatchEnable
          ? `main-es5.js`
          : `main-es5.${hash}.js`;
        return externalLibsDistFile[EXT_MAIN];
      }
    }
   
  ]
};

module.exports = { cpObj, externalLibsDistFile };
