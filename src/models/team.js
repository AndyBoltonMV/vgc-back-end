const { Schema, model } = require("mongoose");

const teamSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  callTimes: { type: Number, required: true, default: 0 },
  image: { type: String },
  liveLink: { type: String },
  continent: { type: String },
  leagueId: { type: Schema.Types.ObjectId, ref: "League" },
  console: { type: String, required: true },
  dates: { type: [String], required: true },
  times: { type: [String], required: true },
  registered: { type: Boolean, required: true, default: false },
  manager: { type: String, required: true },
  managerId: { type: Schema.Types.ObjectId, ref: "User" },
  roster: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
  lineup: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
});

const Team = model("Team", teamSchema);

module.exports = Team;
