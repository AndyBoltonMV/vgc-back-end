const mongoose = require("mongoose");
const { connection } = require("../config");

exports.dbConnectionMiddleware = (uri) => {
  let db = null;

  return async (req, res, next) => {
    if (!db) {
      await connection(uri);
    }

    res.on("finish", async () => {
      await mongoose.disconnect();
      db = null;
    });

    next();
  };
};
