const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { Fixture } = require("../../../src/models");

beforeAll(async () => {
  await setUpDb();
});

afterEach(async () => {
  await sanitizeDb();
});

afterAll(async () => {
  await destroyDb();
});

describe("Fixture model", () => {
  it("should create and save a new fixture successfully", async () => {
    const fixtureData = {
      home: "Team A",
      away: "Team B",
      week: 1,
      date: "2023-03-20",
      time: "13:00",
      lineupHome: ["608c6d2709fe9d07f2b61da8", "608c6d2709fe9d07f2b61da9"],
      lineupAway: ["608c6d2709fe9d07f2b61daa", "608c6d2709fe9d07f2b61dab"],
    };
    const fixture = new Fixture(fixtureData);
    const savedFixture = await fixture.save();
    expect(savedFixture._id).toBeDefined();
    expect(savedFixture.home).toBe(fixtureData.home);
    expect(savedFixture.away).toBe(fixtureData.away);
    expect(savedFixture.week).toBe(fixtureData.week);
    expect(savedFixture.date).toBe(fixtureData.date);
    expect(savedFixture.time).toBe(fixtureData.time);
    expect(savedFixture.homeScore).toBe(0);
    expect(savedFixture.awayScore).toBe(0);
    expect(savedFixture.minutesExtended).toBe(0);
    expect(savedFixture.lineupHome).toEqual(fixtureData.lineupHome);
    expect(savedFixture.lineupAway).toEqual(fixtureData.lineupAway);
    expect(savedFixture.lineupHomeAny).toBeUndefined();
    expect(savedFixture.lineupAwayAny).toBeUndefined();
  });

  it("should fail to save a fixture with missing required fields", async () => {
    const fixtureData = {
      home: "Team A",
      week: 1,
      date: "2023-03-20",
      time: "13:00",
      lineupHome: ["608c6d2709fe9d07f2b61da8", "608c6d2709fe9d07f2b61da9"],
      lineupAway: ["608c6d2709fe9d07f2b61daa", "608c6d2709fe9d07f2b61dab"],
    };
    const fixture = new Fixture(fixtureData);
    let error;
    try {
      await fixture.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.home).toBeDefined();
    expect(error.errors.away).toBeDefined();
    expect(error.errors.week).toBeUndefined();
    expect(error.errors.date).toBeUndefined();
    expect(error.errors.time).toBeUndefined();
    expect(error.errors.lineupHome).toBeUndefined();
    expect(error.errors.lineupAway).toBeUndefined();
  });
});
