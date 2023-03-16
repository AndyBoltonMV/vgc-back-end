const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const Team = require("../../../src/models");

beforeAll(async () => {
  await setUpDb();
});

afterEach(async () => {
  await sanitizeDb();
});

afterAll(async () => {
  await destroyDb();
});

describe("Team model", () => {
  it("should save a team with valid properties", async () => {
    const team = new Team({
      name: "Team A",
      status: "Active",
      callTimes: 3,
      image: "https://example.com/team-a.png",
      liveLink: "https://example.com/team-a-live",
      continent: "Europe",
      leagueId: new mongoose.Types.ObjectId(),
      console: "Xbox",
      dates: ["2022-04-01", "2022-04-02"],
      times: ["19:00", "20:00"],
      registered: true,
      manager: "John Doe",
      managerId: new mongoose.Types.ObjectId(),
      roster: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      lineup: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });
    const savedTeam = await team.save();
    expect(savedTeam._id).toBeDefined();
    expect(savedTeam.name).toBe("Team A");
    expect(savedTeam.status).toBe("Active");
    expect(savedTeam.callTimes).toBe(3);
    expect(savedTeam.image).toBe("https://example.com/team-a.png");
    expect(savedTeam.liveLink).toBe("https://example.com/team-a-live");
    expect(savedTeam.continent).toBe("Europe");
    expect(savedTeam.leagueId).toBeDefined();
    expect(savedTeam.console).toBe("Xbox");
    expect(savedTeam.dates).toEqual(["2022-04-01", "2022-04-02"]);
    expect(savedTeam.times).toEqual(["19:00", "20:00"]);
    expect(savedTeam.registered).toBe(true);
    expect(savedTeam.manager).toBe("John Doe");
    expect(savedTeam.managerId).toBeDefined();
    expect(savedTeam.roster).toHaveLength(2);
    expect(savedTeam.lineup).toHaveLength(2);
  });

  it("should not save a team without a name", async () => {
    const team = new Team({
      status: "Active",
      callTimes: 3,
      image: "https://example.com/team-a.png",
      liveLink: "https://example.com/team-a-live",
      continent: "Europe",
      leagueId: new mongoose.Types.ObjectId(),
      console: "Xbox",
      dates: ["2022-04-01", "2022-04-02"],
      times: ["19:00", "20:00"],
      registered: true,
      manager: "John Doe",
      managerId: new mongoose.Types.ObjectId(),
      roster: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      lineup: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });
    let err;
    try {
      await team.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
