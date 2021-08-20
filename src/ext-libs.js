const extDefinition = [];

const extWebpack = extDefinition.forEach((lib) => lib.export);

module.exports = { extDefinition, extWebpack };

/* Example external libs */
/* Array Object of external libraries to be included

const extDefinition = [
  {
    module: "d3",
    entry: "dist/d3.js",
    export: {
      d3: "d3"
    }
  }
];

*/
