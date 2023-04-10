const { Request } = require("jest-express/lib/request");
const { Response } = require("jest-express/lib/response");
const { Team, User } = require("../../../src/models");
const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const {
  createTeam,
  getTeamById,
  getTeams,
  updateTeam,
  updateRoster,
  updateLineup,
  deleteTeam,
} = require("../../../src/controllers");
const { mockTeam, mockUser } = require("../../../__mocks__/data.mock");
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

describe("Team Basic CRUD", () => {
  it("creates a new team and sends it in the response", async () => {
    req.body = mockTeam;
    jest.spyOn(Team, "create").mockResolvedValueOnce(mockTeam);

    await createTeam(req, res, next);

    expect(Team.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(mockTeam);
  });

  it("calls the next function with the error if the team creation fails", async () => {
    const mockError = new Error("500 Team creation failed");
    jest.spyOn(Team, "create").mockRejectedValueOnce(mockError);

    await createTeam(req, res, next);

    expect(Team.create).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("gets all teams with league data and sends them in the response", async () => {
    const mockTeams = [new Team(mockTeam), new Team(mockTeam)];
    await mockTeams[0].save();
    await mockTeams[1].save();
    req.body.filterObj = { name: mockTeam.name };

    await getTeams(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("calls the next function with the error if getting teams fails", async () => {
    const mockError = new Error("404 Failed to get teams");
    jest.spyOn(Team, "find").mockRejectedValueOnce(mockError);

    await getTeams(req, res, next);
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should return the team with the given ID", async () => {
    const team = await Team.create(mockTeam);
    Team.findById = jest.fn().mockResolvedValueOnce(mockTeam);
    req.params.id = team._id;

    await getTeamById(req, res, next);

    expect(Team.findById).toHaveBeenCalledWith(team._id);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(mockTeam);

    Team.findById.mockRestore();
  });

  // Test case 2
  it("should throw a 404 error if the team with the given ID does not exist", async () => {
    Team.findById = jest.fn().mockResolvedValueOnce(null);
    req.params.id = "1";

    await getTeamById(req, res, next);

    expect(Team.findById).toHaveBeenCalledWith("1");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].message).toEqual("404 Team not found");
  });

  it("should update a team successfully", async () => {
    const team = await Team.create(mockTeam);
    req.params.id = team._id;
    req.body = {};
    req.body.updateObj = { name: "Updated Team Name" };

    await updateTeam(req, res, next);
    const updatedTeam = await Team.findOne({ _id: team._id });
    expect(updatedTeam).toHaveProperty("name", "Updated Team Name");

    expect(res.statusCode).toBe(200);
  });

  it("should throw a 404 error if team is not found", async () => {
    const updateObj = { name: "Updated Team Name" };
    req.params = { id: new mongoose.Types.ObjectId() };
    req.body = { updateObj };
    await updateTeam(req, res, next);

    expect(res.sendStatus).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledWith(new Error("404 Team not found"));
  });

  it("should add a user to the roster successfully", async () => {
    const team = await Team.create(mockTeam);
    req.params = { id: team._id };
    req.body = {};
    req.body.userId = new mongoose.Types.ObjectId();

    await updateRoster(req, res, next);

    const updatedTeam = await Team.findOne({ _id: team._id });

    expect(updatedTeam.roster.length).toBe(3);
    expect(updatedTeam.roster[2].toString()).toBe(String(req.body.userId));
    expect(res.statusCode).toBe(200);
  });

  it("should remove a user from the roster successfully", async () => {
    const team = await Team.create(mockTeam);

    req.body = {};
    req.body.remove = true;
    req.params.id = team._id;
    req.body.userId = team.roster[0];

    await updateRoster(req, res, next);
    const updatedTeam = await Team.findOne({ _id: team._id });

    expect(updatedTeam.roster.length).toBe(1);
    expect(res.statusCode).toBe(200);
  });

  it("should return a 404 error if the team is not found", async () => {
    await updateRoster(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("404 Team not found"));
  });

  it("should add a user to the lineup successfully", async () => {
    const team = await Team.create(mockTeam);
    req.body = {};
    req.params = {};
    req.params.id = team._id;
    req.body.userId = new mongoose.Types.ObjectId();

    await updateLineup(req, res, next);
    const updatedTeam = await Team.findOne({ _id: team._id });
    expect(String(updatedTeam.lineup[2])).toBe(String(req.body.userId));

    expect(res.statusCode).toBe(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("should remove a user from the lineup successfully", async () => {
    const team = await Team.create(mockTeam);
    req.body = {};
    req.params = {};
    req.params.id = team._id;
    req.body.userId = new mongoose.Types.ObjectId();
    req.body.remove = true;

    await updateLineup(req, res, next);
    const updatedTeam = await Team.findOne({ _id: team._id });
    expect(updatedTeam.lineup).not.toContain(req.body.userId);

    expect(res.statusCode).toBe(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if team is not found", async () => {
    req.body = {};
    req.params = {};
    req.params.id = "non-existent-id";
    req.body.userId = "user123";

    await updateLineup(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should delete a team successfully", async () => {
    const team = await Team.create(mockTeam);
    req.params = { id: team._id };
    await deleteTeam(req, res, next);

    const deletedTeam = await Team.findOne({ _id: team._id });
    expect(deletedTeam).toBeNull();
    expect(res.body).toHaveProperty("_id", team._id);
    expect(res.statusCode).toBe(204);
  });

  it("should return 404 if the team is not found", async () => {
    await deleteTeam(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe("404 Team not found");
  });
});
