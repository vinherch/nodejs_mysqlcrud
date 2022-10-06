const fs = require("fs");

module.exports = {
  readFile: async (path) => {
    if (typeof path == "string") {
      return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
          if (err) rej(err);
          res(data);
        });
      });
    }
  },
};
