const request = require("supertest");
const app = require("express")();
const { teamRouter } = require("../../../src/routes");
const {
  createTeam,
  getTeamById,
  getTeams,
  updateTeam,
  updateRoster,
  updateLineup,
  deleteTeam,
} = require("../../../src/controllers/team");

const fakeController = (req, res, next) => {
  res.send({ message: "Success" });
};
jest.mock("../../../src/controllers/team", () => ({
  createTeam: jest.fn(fakeController),
  getTeamById: jest.fn(fakeController),
  getTeams: jest.fn(fakeController),
  updateTeam: jest.fn(fakeController),
  updateRoster: jest.fn(fakeController),
  updateLineup: jest.fn(fakeController),
  deleteTeam: jest.fn(fakeController),
}));

app.use(teamRouter);
afterEach(() => {
  jest.clearAllMocks();
});

describe("team routes", () => {
  describe("createTeam", () => {
    it("should call createTeam", async () => {
      await request(app).post("/");
      expect(createTeam).toHaveBeenCalled();
    });
  });

  describe("getTeamById", () => {
    it("should call getTeamById", async () => {
      await request(app).get("/1");
      expect(getTeamById).toHaveBeenCalled();
    });
  });

  describe("getTeams", () => {
    it("should call getTeams", async () => {
      await request(app).get("/");
      expect(getTeams).toHaveBeenCalled();
    });
  });

  describe("updateTeam", () => {
    it("should call updateTeam", async () => {
      await request(app).put("/1");
      expect(updateTeam).toHaveBeenCalled();
    });
  });

  describe("updateRoster", () => {
    it("should call updateRoster", async () => {
      await request(app).put("/update-roster/1");
      expect(updateRoster).toHaveBeenCalled();
    });
  });

  describe("updateLineup", () => {
    it("should call updateLineup", async () => {
      await request(app).put("/update-lineup/1");
      expect(updateLineup).toHaveBeenCalled();
    });
  });

  describe("deleteTeam", () => {
    it("should call deleteTeam", async () => {
      await request(app).delete("/1");
      expect(deleteTeam).toHaveBeenCalled();
    });
  });
});
