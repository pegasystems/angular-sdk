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
    ]
};

module.exports = { cpObj };