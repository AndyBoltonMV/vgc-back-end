const { Request } = require("jest-express/lib/request");
const { Response } = require("jest-express/lib/response");
const { User } = require("../../../src/models");
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
    await User.create(mockUser);
    req.body.filter = { username: mockUser.username };
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
    req.body.filter = {};
    await readUsers(req, res, next);
    expect(res.body.users.length).toBe(2);
  });

  it("should send a user back", async () => {
    req.user = await User.create(mockUser);
    console.log(req.user);
    await login(req, res, next);
    console.log(res.body);
    expect(res.body.user).toHaveProperty("username", mockUser.username);
  });
});
