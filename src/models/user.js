const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isManager: { type: Boolean, required: true, default: false },
  xboxName: { type: String },
  psName: { type: String },
  youtube: { type: String },
  twitch: { type: String },
  playstation: { type: String },
  position: { type: String },
  membership: { type: String },
  profileImage: { type: String },
  leagues: [{ type: Schema.Types.ObjectId, ref: "League" }],
  contractOffers: [{ type: Schema.Types.ObjectId, ref: "Contract" }],
  trophies: {
    cleanSheets: { type: Number },
    divisionEight: { type: Number },
    divisionSeven: { type: Number },
    divisionSix: { type: Number },
    divisionFive: { type: Number },
    divisionFour: { type: Number },
    divisionThree: { type: Number },
    divisionTwo: { type: Number },
    divisionOne: { type: Number },
    goldenBoot: { type: Number },
    goldenGlove: { type: Number },
    mostAssists: { type: Number },
    mostHeaders: { type: Number },
    mostIntercepts: { type: Number },
    mostPasses: { type: Number },
    mostTackles: { type: Number },
    vgcdOr: { type: Number },
  },
});

const User = model("User", userSchema);

module.exports = User;
