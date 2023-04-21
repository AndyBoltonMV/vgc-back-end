const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { Fixture } = require("../../../src/models");
const { mockFixture } = require("../../../__mocks__/data.mock");

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
    const fixture = new Fixture(mockFixture);
    const savedFixture = await fixture.save();
    expect(savedFixture._id).toBeDefined();
    expect(savedFixture.home).toBe(mockFixture.home);
    expect(savedFixture.away).toBe(mockFixture.away);
    expect(savedFixture.week).toBe(mockFixture.week);
    expect(savedFixture.date).toBe(mockFixture.date);
    expect(savedFixture.time).toBe(mockFixture.time);
    expect(savedFixture.homeScore).toBe(0);
    expect(savedFixture.awayScore).toBe(0);
    expect(savedFixture.minutesExtended).toBe(0);
    expect(savedFixture.lineupHome.length).toEqual(
      mockFixture.lineupHome.length
    );
    expect(savedFixture.lineupAway.length).toEqual(
      mockFixture.lineupAway.length
    );
    expect(savedFixture.lineupHomeAny).toBeUndefined();
    expect(savedFixture.lineupAwayAny).toBeUndefined();
  });

  it("should fail to save a fixture with missing required fields", async () => {
    const brokenFixtureData = {
      home: "Team A",
      week: 1,
      date: "2023-03-20",
      time: "13:00",
      lineupHome: ["608c6d2709fe9d07f2b61da8", "608c6d2709fe9d07f2b61da9"],
      lineupAway: ["608c6d2709fe9d07f2b61daa", "608c6d2709fe9d07f2b61dab"],
    };
    const fixture = new Fixture(brokenFixtureData);
    let error;
    try {
      await fixture.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
