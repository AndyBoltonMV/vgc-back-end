const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/middleware", () => ({
  errorHandler: jest.fn(),
  dbConnectionMiddleware: jest.fn((mongoUri) => (req, res, next) => next()),
  dbDisconnect: jest.fn(),
}));

jest.mock("../../src/routes", () => ({
  userRouter: jest.fn((req, res, next) => res.send("User route")),
  teamRouter: jest.fn((req, res, next) => res.send("Team route")),
  leagueRouter: jest.fn((req, res, next) => res.send("League route")),
}));

describe("app.js", () => {
  describe("middleware", () => {
    it("uses CORS middleware with default origin", () => {
      expect(app._router.stack[2].name).toBe("corsMiddleware");
    });

    it("uses JSON middleware", () => {
      expect(app._router.stack[3].name).toBe("jsonParser");
    });
  });

  describe("routes", () => {
    it("uses userRouter for /user", async () => {
      const response = await request(app).get("/user");
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("User route");
      expect(require("../../src/routes").userRouter).toHaveBeenCalled();
    });

    it("uses teamRouter for /team", async () => {
      const response = await request(app).get("/team");
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Team route");
      expect(require("../../src/routes").teamRouter).toHaveBeenCalled();
    });

    it("uses leagueRouter for /league", async () => {
      const response = await request(app).get("/league");
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("League route");
      expect(require("../../src/routes").leagueRouter).toHaveBeenCalled();
    });
  });
});
