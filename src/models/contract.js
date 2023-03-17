const { Schema, model } = require("mongoose");

const contractSchema = new Schema({
  continent: { type: String, required: true },
  time: { type: String, required: true },
  manager: { type: String, required: true },
  console: { type: String, required: true },
  length: { type: Number, required: true },
  teamName: { type: String, required: true },
  image: { type: String },
  divisionLogo: { type: String, required: true },
  managerImage: { type: String },
});

const Contract = model("Contract", contractSchema);

module.exports = Contract;
