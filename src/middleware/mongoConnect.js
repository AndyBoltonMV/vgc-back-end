const mongoose = require("mongoose");
const { connection, saveURI } = require("../config");

exports.dbConnectionMiddleware = async (req, res, next) => {
  try {
    const uri = await saveURI();
    await connection(uri);
    next();
  } catch (error) {
    next(error);
  }
};

exports.dbDisconnect = async (req, res, next) => {
  try {
    await mongoose.disconnect();
    next();
  } catch (error) {
    next(error);
  }
};
