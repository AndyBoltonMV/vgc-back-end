const { Request } = require("jest-express/lib/request");
const { Response } = require("jest-express/lib/response");
const { User } = require("../../../src/models");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  checkPassword,
  checkToken,
} = require("../../../src/middleware");
const { rounds, secret } = require("../../../src/config");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { mockUser } = require("../../../__mocks__/data.mock");
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

describe("hashPassword", () => {
  it("should call next middleware function", async () => {
    await hashPassword(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should hash password in req.body.password", async () => {
    req.body = {
      password: "test123",
    };
    await hashPassword(req, res, next);

    expect(req.body.password).not.toEqual("test123");
  });

  it("should hash password in req.body.updateObj.password", async () => {
    req.body = {
      updateObj: {
        password: "test123",
      },
    };
    await hashPassword(req, res, next);

    expect(req.body.updateObj.password).not.toEqual("test123");
  });
});

describe("checkPassword", () => {
  test("should call next middleware function", async () => {
    req.body = { username: mockUser.username, password: mockUser.password };
    mockUser.password = await bcrypt.hash(
      mockUser.password,
      await bcrypt.genSalt(rounds)
    );
    await User.create(mockUser);
    await checkPassword(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should set req.user if user is found", async () => {
    req.body = { username: mockUser.username, password: mockUser.password };
    mockUser.password = await bcrypt.hash(
      mockUser.password,
      await bcrypt.genSalt(rounds)
    );
    await User.create(mockUser);
    await checkPassword(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.username).toEqual(mockUser.username);
  });

  test("should throw error if user is not found", async () => {
    req.body = { username: mockUser.username, password: mockUser.password };
    await checkPassword(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error("404 No user found"));
  });

  test("should call next with error if password is incorrect", async () => {
    req.body = { username: mockUser.username, password: "test123" };
    mockUser.password = await bcrypt.hash(
      mockUser.password,
      await bcrypt.genSalt(rounds)
    );
    await User.create(mockUser);
    await checkPassword(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error("404 No user found"));
  });
});

describe("checkToken", () => {
  test("should call next middleware function", async () => {
    const user = await User.create(mockUser);
    req.setHeaders({
      Authorization: jwt.sign({ _id: user._id }, secret),
    });
    await checkToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should set req.user if user is found", async () => {
    const user = await User.create(mockUser);
    req.setHeaders({
      Authorization: jwt.sign({ _id: user._id }, secret),
    });
    await checkToken(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user._id).toEqual(user._id);
  });

  test("should throw error if token is invalid", async () => {
    req.setHeaders({
      Authorization: "steve",
    });
    await checkToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      new jwt.JsonWebTokenError("jwt malformed")
    );
  });

  test("should throw error if user is not found", async () => {
    req.setHeaders({
      Authorization: jwt.sign({ _id: new mongoose.Types.ObjectId() }, secret),
    });
    await checkToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error("404 No user found"));
  });
});
