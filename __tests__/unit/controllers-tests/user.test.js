const { Request } = require("jest-express/lib/request");
const { Response } = require("jest-express/lib/response");
const mongoose = require("mongoose");
const { User, Contract } = require("../../../src/models");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const {
  createUser,
  readUser,
  readUsers,
  login,
  genericUpdate,
  updateLeague,
  updateContract,
  deleteUser,
} = require("../../../src/controllers");
const { mockUser, mockContract } = require("../../../__mocks__/data.mock");
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

describe("User CRUD unit tests", () => {
  it("should create a user from the req.body", async () => {
    req.body = mockUser;
    await createUser(req, res);
    expect(await User.findOne({ username: mockUser.username }));
  });

  it("should call res.send at the end of the controller", async () => {
    req.body = mockUser;
    await createUser(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it("should find one user", async () => {
    const testUser = await User.create(mockUser);
    req.params = { id: testUser._id };
    await readUser(req, res, next);
    const user = await User.findOne({ username: mockUser.username });
    expect(res.body.position).toBe(user.position);
  });

  it("should find many users", async () => {
    await User.create(mockUser);
    await User.create({
      username: "tester",
      email: "tester@email.com",
      password: "test123",
    });
    req.query = {};
    await readUsers(req, res, next);
    expect(res.body.users.length).toBe(2);
  });

  it("should send a user back", async () => {
    req.user = await User.create(mockUser);
    await login(req, res, next);
    expect(res.body.user).toHaveProperty("username", mockUser.username);
  });

  it("should update any field", async () => {
    const user = await User.create(mockUser);
    req.body = {};
    req.params.id = user._id;
    req.body.updateObj = { username: "new username" };
    await genericUpdate(req, res, next);
    expect(await User.findById(user._id)).toHaveProperty(
      "username",
      "new username"
    );
  });

  it("should add league id", async () => {
    const user = await User.create(mockUser);
    req.body = {};
    req.params.id = user._id;
    req.body.leagueId = new mongoose.Types.ObjectId();
    await updateLeague(req, res, next);
    const result = await User.findById(user._id);
    expect(result.leagues.length).toBe(3);
    expect(String(result.leagues[2])).toBe(String(req.body.leagueId));
  });

  it("should remove league id", async () => {
    const user = await User.create(mockUser);
    req.body = {
      remove: true,
    };
    req.params.id = user._id;
    req.body.leagueId = user.leagues[0];
    await updateLeague(req, res, next);
    const result = await User.findById(user._id);
    expect(result.leagues.length).toBe(1);
    expect(result.leagues[0]).not.toBe(user.leagues[0]);
  });

  it("should add contract id", async () => {
    const user = await User.create(mockUser);
    req.body = {};
    req.params.id = user._id;
    req.body.contract = mockContract;
    await updateContract(req, res, next);
    const result = await User.findById(user._id);
    expect(result.contractOffers.length).toBe(3);
    expect(await Contract.findById(result.contractOffers[2])).toBeTruthy();
  });

  it("should remove contract id", async () => {
    const user = await User.create(mockUser);
    req.body = {
      remove: true,
    };
    req.params.id = user._id;
    req.body.contractId = user.contractOffers[0];
    await updateContract(req, res, next);
    const result = await User.findById(user._id);
    expect(result.contractOffers.length).toBe(1);
    expect(result.contractOffers[0]).not.toBe(user.contractOffers[0]);
  });

  it("should delete user", async () => {
    const user = await User.create(mockUser);
    expect(await User.findById(user._id)).toBeTruthy();
    req.user = user;
    await deleteUser(req, res, next);
    expect(await User.findById(user._id)).toBeFalsy();
  });
});
