const request = require("supertest");
const app = require("express")();
const { leagueRouter } = require("../../../src/routes");
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

const fakeController = (req, res, next) => {
  res.send({ message: "Success" });
};

jest.mock("../../../src/controllers", () => ({
  createLeague: jest.fn(fakeController),
  getAllLeagues: jest.fn(fakeController),
  getLeagueById: jest.fn(fakeController),
  updateLeagueGeneric: jest.fn(fakeController),
  addFixtures: jest.fn(fakeController),
  updateFixtures: jest.fn(fakeController),
  updateTeams: jest.fn(fakeController),
  deleteLeague: jest.fn(fakeController),
}));

app.use(leagueRouter);

describe("league routes", () => {
  describe("createLeague", () => {
    it("should call createLeague", async () => {
      await request(app).post("/");
      expect(createLeague).toHaveBeenCalled();
    });
  });

  describe("getAllLeagues", () => {
    it("should call getAllLeagues", async () => {
      await request(app).get("/");
      expect(getAllLeagues).toHaveBeenCalled();
    });
  });

  describe("getLeagueById", () => {
    it("should call getLeagueById", async () => {
      await request(app).get("/1");
      expect(getLeagueById).toHaveBeenCalled();
    });
  });

  describe("updateLeagueGeneric", () => {
    it("should call updateGenericLeague", async () => {
      await request(app).put("/1");
      expect(updateLeagueGeneric).toHaveBeenCalled();
    });
  });

  describe("addFixtures", () => {
    it("should call addFixtures", async () => {
      await request(app).put("/add-fixture/1");
      expect(addFixtures).toHaveBeenCalled();
    });
  });

  describe("updateFixtures", () => {
    it("should call updateFixtures", async () => {
      await request(app).put("/update-fixture/1");
      expect(updateFixtures).toHaveBeenCalled();
    });
  });

  describe("updateTeams", () => {
    it("should call updateTeams", async () => {
      await request(app).put("/update-teams/1");
      expect(updateTeams).toHaveBeenCalled();
    });
  });

  describe("deleteLeague", () => {
    it("should call deleteLeague", async () => {
      await request(app).delete("/1");
      expect(deleteLeague).toHaveBeenCalled();
    });
  });
});
