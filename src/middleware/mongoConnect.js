const mongoose = require("mongoose");

exports.dbConnectionMiddleware = (uri) => {
  let connection = null;

  return (req, res, next) => {
    if (!connection) {
      connection = mongoose.createConnection(uri);
    }

    req.db = connection;

    res.on("finish", () => {
      connection.close();
      connection = null;
    });

    next();
  };
};
