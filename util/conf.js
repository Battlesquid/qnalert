const prodconfig = require("../config.json");
const devconfig = require("../devconfig.json");

module.exports = {
    get: () => {
        if(process.env.PROD === "false") {
            return devconfig;
        } else {
            return prodconfig;
        }
    }
};
