const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  leagueName: { type: String, required: true },
  fixtures: {
    type: Array,
    contains: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  continent: { type: String, required: true },
  division: { type: Number, required: true },
  console: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: String, required: true },
  dates: { type: [String], required: true },
  times: { type: [String], required: true },
  rounds: { type: Number, required: true },
  teamNames: { type: Array, contains: { type: String }, required: true },
  teams: {
    type: Array,
    contains: { type: Schema.Types.ObjectId, ref: "Team" },
  },
});

const League = mongoose.model("League", leagueSchema);

module.exports = League;
