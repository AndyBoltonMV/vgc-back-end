const { Request } = require("jest-express/lib/request");
const { Response } = require("jest-express/lib/response");
const { League, Fixture, Team } = require("../../../src/models");
const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const {
  createLeague,
  getAllLeagues,
  getLeagueById,
  updateLeagueGeneric,
  addFixtures,
  updateFixtures,
  updateTeams,
  deleteLeague,
} = require("../../../src/controllers");
const {
  mockLeague,
  mockFixture,
  mockTeam,
} = require("../../../__mocks__/data.mock");
let req, res, next;

beforeAll(async () => {
  await setUpDb();
});

beforeEach(async () => {
  req = new Request();
  res = new Response();
  next = jest.fn();
});

afterEach(async () => {
  await sanitizeDb();
  await req.resetMocked();
  await res.resetMocked();
});

afterAll(async () => {
  await destroyDb();
});

describe("League basic CRUD", () => {
  it("should create a new league and return it with status 201", async () => {
    req.body = mockLeague;

    await createLeague(req, res, next);

    expect(req.response.status).toBe(201);
    expect(req.response.body).toHaveProperty("leagueName", "Test League");
  });

  it("should call next with an error if League.create throws an error", async () => {
    req.body = {};
    const error = new Error("test error");
    jest.spyOn(League, "create").mockRejectedValueOnce(error);

    await createLeague(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return all leagues in the database", async () => {
    const mockLeagues = [mockLeague, mockLeague];
    await League.insertMany(mockLeagues);

    await getAllLeagues(req, res, next);

    expect(req.response.status).toBe(200);
    expect(req.response.body.length).toBe(2);
  });

  it("should handle errors", async () => {
    const errorMessage = "Error fetching leagues";
    jest.spyOn(League, "find").mockRejectedValue(new Error(errorMessage));

    await getAllLeagues(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  it("should return 200 status code and the league if it exists", async () => {
    const league = await League.create(mockLeague);

    req.params = { id: league._id };

    await getLeagueById(req, res, next);

    expect(req.response.status).toBe(200);
    expect(req.response.body).toHaveProperty("_id", league._id);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw an error with a 404 status code if the league does not exist", async () => {
    req.params = { id: new mongoose.Types.ObjectId() };

    await getLeagueById(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error("404 League not found"));
  });

  it("should return 404 if the league does not exist", async () => {
    req.params = {
      id: new mongoose.Types.ObjectId(),
    };
    req.body = {
      updateObj: {
        name: "New League Name",
      },
    };
    await updateLeagueGeneric(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("404 League not found"));
  });

  it("should update the league and return 200", async () => {
    const league = await League.create(mockLeague);

    req.params = {
      id: league._id,
    };
    req.body = {
      updateObj: {
        leagueName: "New League Name",
      },
    };
    await updateLeagueGeneric(req, res, next);
    expect(req.response.status).toBe(200);

    const updatedLeague = await League.findOne({ _id: league._id });
    expect(updatedLeague.leagueName).toBe("New League Name");
  });

  it("should add a new fixture to the league's fixture list", async () => {
    const league = await League.create(mockLeague);
    const fixture = await Fixture.create(mockFixture);
    (req.params = { id: league._id }), (req.body = { fixture });

    await addFixtures(req, res, next);

    const result = await League.findOne({ _id: league._id });
    expect(String(result.fixtures[1])).toBe(String(fixture._id));
    expect(req.response.status).toBe(200);
    expect(next).toHaveBeenCalled();
  });

  it("should remove a fixture from the league's fixture list", async () => {
    const league = await League.create(mockLeague);
    const fixture = await Fixture.create(mockFixture);
    await League.findByIdAndUpdate(league._id, {
      $push: { fixtures: fixture._id },
    });
    req.params = { id: league._id };
    req.body = { remove: true, fixtureId: fixture._id };

    await addFixtures(req, res, next);
    const result = await League.findOne({ _id: league._id });
    expect(result.fixtures.length).toBe(1);
    expect(req.response.status).toBe(200);
    expect(next).toHaveBeenCalled();
  });

  it("should return a 404 error if the league is not found", async () => {
    const leagueId = new mongoose.Types.ObjectId();
    req.params = { id: leagueId };
    (req.body = {}), await addFixtures(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return a 404 error if the fixture is not found", async () => {
    req.params = { id: new mongoose.Types.ObjectId() };
    req.body = { updateObj: {} };

    await updateFixtures(req, res, next);

    expect(next).toBeCalledWith(new Error("404 fixture not found"));
  });

  it("should update a fixture and return a 200 status code", async () => {
    const fixture = await Fixture.create(mockFixture);
    const updateObj = { homeScore: 1, awayScore: 3 };
    req.params = { id: fixture._id };
    req.body = { updateObj };

    await updateFixtures(req, res, next);
    const result = await Fixture.findOne({ _id: fixture._id });
    expect(result.homeScore).toBe(1);
    expect(result.awayScore).toBe(3);
    expect(req.response.status).toBe(200);
    expect(next).toBeCalled();
  });

  it("should update league with new team", async () => {
    const league = await League.create(mockLeague);
    const team = await Team.create(mockTeam);
    req.body = {
      teamId: team._id,
    };
    req.params = {
      id: league._id,
    };
    await updateTeams(req, res, next);

    expect(req.response.status).toBe(200);
    expect(next).toHaveBeenCalled();
  });

  it("should remove team from league", async () => {
    const league = await League.create(mockLeague);
    const team = await Team.create(mockTeam);
    req.body = {
      teamId: team._id,
    };
    req.params = {
      id: league._id,
    };
    req.body.remove = true;

    await updateTeams(req, res, next);

    expect(req.response.status).toBe(200);
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if league is not found", async () => {
    const team = await Team.create(mockTeam);
    req.body = {
      teamId: team._id,
    };
    req.params = {
      id: new mongoose.Types.ObjectId(),
    };

    await updateTeams(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new Error("404 team or league not found")
    );
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("should call next with error if team is not found", async () => {
    const league = await League.create(mockLeague);
    req.body = {
      teamId: new mongoose.Types.ObjectId(),
    };
    req.params = {
      id: league._id,
    };

    await updateTeams(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new Error("404 team or league not found")
    );
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("should delete a league and return 204 status", async () => {
    const league = await League.create(mockLeague);
    req.params = { id: league._id };
    await deleteLeague(req, res, next);
    expect(req.response.status).toBe(204);
    expect(next).toHaveBeenCalled();
  });

  it("should throw a 404 error if the league does not exist", async () => {
    req.params = { id: new mongoose.Types.ObjectId() };
    await deleteLeague(req, res, next);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error("404 League not found"));
  });
});
