const path = require("path");

const cpObj = {
    patterns: [
        {
            from: "src/assets/**/*.*",
            to: "dist/",
            transformPath(from) {
                return from.replace(`src${path.sep}`, "");;
            }
        },
        {
            from: "node_modules/constellationui-cli/src/bootstrap-shell.js",
            to: "dist/bootstrap-shell.js"
        },
        {
            from: "node_modules/constellationui-cli/src/bootstrap-shell.js",
            to: "dist/bootstrap-shell-mashup.js",
            transform(content){
                return content.toString().replace(/(export)[\s\S]*(\})/g, "")
            }
        },
    ]
};

module.exports = { cpObj };