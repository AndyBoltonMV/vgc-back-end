const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { League } = require("../../../src/models");

beforeAll(async () => {
  await setUpDb();
});

afterEach(async () => {
  await sanitizeDb();
});

afterAll(async () => {
  await destroyDb();
});

describe("League model", () => {
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
