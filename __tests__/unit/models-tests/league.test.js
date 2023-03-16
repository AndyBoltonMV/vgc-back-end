const mongoose = require("mongoose");
const { League } = require("../../../src/models");

describe("League model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/myapp", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await League.deleteMany();
  });

  it("should save a valid league", async () => {
    const league = new League({
      leagueName: "Test League",
      fixtures: ["123456789012"],
      continent: "North America",
      division: 1,
      console: "Xbox",
      status: "Active",
      startDate: "2022-01-01",
      dates: ["2022-01-01", "2022-01-02"],
      times: ["19:00", "21:00"],
      rounds: 10,
      teamNames: ["Team 1", "Team 2"],
      teams: ["123456789012", "345678901234"],
    });
    await league.save();
    const savedLeague = await League.findOne({ leagueName: "Test League" });
    expect(savedLeague).toMatchObject(league.toObject());
  });

  it("should require leagueName", async () => {
    const league = new League({
      fixtures: ["123456789012"],
      continent: "North America",
      division: 1,
      console: "Xbox",
      status: "Active",
      startDate: "2022-01-01",
      dates: ["2022-01-01", "2022-01-02"],
      times: ["19:00", "21:00"],
      rounds: 10,
      teamNames: ["Team 1", "Team 2"],
      teams: ["123456789012", "345678901234"],
    });
    await expect(league.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should require continent", async () => {
    const league = new League({
      leagueName: "Test League",
      fixtures: ["123456789012"],
      division: 1,
      console: "Xbox",
      status: "Active",
      startDate: "2022-01-01",
      dates: ["2022-01-01", "2022-01-02"],
      times: ["19:00", "21:00"],
      rounds: 10,
      teamNames: ["Team 1", "Team 2"],
      teams: ["123456789012", "345678901234"],
    });
    await expect(league.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
