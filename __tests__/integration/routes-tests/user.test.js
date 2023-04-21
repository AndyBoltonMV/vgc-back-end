const request = require("supertest");
const app = require("express")();
const { userRouter } = require("../../../src/routes");
const {
  createUser,
  readUser,
  readUsers,
  login,
  genericUpdate,
  updateLeague,
  updateContract,
  deleteUser,
} = require("../../../src/controllers/user");

const {
  hashPassword,
  checkPassword,
  checkToken,
} = require("../../../src/middleware/auth");

const fakeController = (req, res, next) => {
  res.send({ message: "Success" });
};

const fakeMiddleware = (req, res, next) => {
  next();
};

jest.mock("../../../src/controllers/team", () => ({
  createUser: jest.fn(fakeController),
  readUser: jest.fn(fakeController),
  readUsers: jest.fn(fakeController),
  login: jest.fn(fakeController),
  genericUpdate: jest.fn(fakeController),
  updateLeague: jest.fn(fakeController),
  updateContract: jest.fn(fakeController),
  deleteUser: jest.fn(fakeController),
  hashPassword: jest.fn(fakeMiddleware),
  checkPassword: jest.fn(fakeMiddleware),
  checkToken: jest.fn(fakeMiddleware),
}));

app.use(userRouter);

describe("user routes", () => {
  describe("createUser", () => {
    it("should call hashPassword and createUser", async () => {
      await request(app).post("/");
      expect(hashPassword).toHaveBeenCalled();
      expect(createUser).toHaveBeenCalled();
    });
  });
  describe("readUser", () => {
    it("should call readUser", async () => {
      await request(app).get("/1");
      expect(readUser).toHaveBeenCalled();
    });
  });
  describe("readUsers", () => {
    it("should call readUsers", async () => {
      await request(app).get("/");
      expect(readUsers).toHaveBeenCalled();
    });
  });
  describe("login post", () => {
    it("should call checkPassword and login", async () => {
      await request(app).post("/login");
      expect(checkPassword).toHaveBeenCalled();
      expect(login).toHaveBeenCalled();
    });
  });
  describe("login get", () => {
    it("should call checkToken and login", async () => {
      await request(app).get("/login");
      expect(checkToken).toHaveBeenCalled();
      expect(login).toHaveBeenCalled();
    });
  });
  describe("genericUpdate", () => {
    it("should call hashPassword and genericUpdate", async () => {
      await request(app).put("/1");
      expect(hashPassword).toHaveBeenCalled();
      expect(genericUpdate).toHaveBeenCalled();
    });
  });
  describe("updateLeague", () => {
    it("should call updateLeague", async () => {
      await request(app).put("/update-league/1");
      expect(updateLeague).toHaveBeenCalled();
    });
  });
  describe("updateContract", () => {
    it("should call updateContract", async () => {
      await request(app).put("/update-contract/1");
      expect(updateContract).toHaveBeenCalled();
    });
  });
  describe("deleteUser", () => {
    it("should call deleteUser", async () => {
      await request(app).delete("/1");
      expect(deleteUser).toHaveBeenCalled();
    });
  });
});
