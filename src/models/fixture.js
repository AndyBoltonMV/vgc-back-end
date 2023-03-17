const { Schema, model } = require("mongoose");

const fixtureSchema = new Schema({
  home: { type: String, required: true },
  away: { type: String, required: true },
  week: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  homeScore: { type: Number, required: true, default: 0 },
  awayScore: { type: Number, required: true, default: 0 },
  minutesExtended: { type: Number, required: true, default: 0 },
  lineupHome: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
  },
  lineupAway: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
  },
  lineupHomeAny: { type: String },
  lineupAwayAny: { type: String },
});

module.exports = model("Fixture", fixtureSchema);
