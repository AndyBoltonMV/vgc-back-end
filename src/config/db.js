const mongoose = require("mongoose");

exports.connection = async (uri) => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    throw new Error(error);
  }
};
