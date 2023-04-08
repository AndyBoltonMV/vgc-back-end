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
const { it } = require("node:test");
const mockUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  isManager: false,
  xboxName: "TestXboxName",
  psName: "TestPSName",
  youtube: "TestYoutubeChannel",
  twitch: "TestTwitchChannel",
  playstation: "TestPlaystation",
  position: "TestPosition",
  membership: "TestMembership",
  profileImage: "https://example.com/testuser.jpg",
  leagues: ["609b60ebd100e033048cbc2b", "609b60ebd100e033048cbc2c"],
  contractOffers: ["609b60ebd100e033048cbc2d", "609b60ebd100e033048cbc2e"],
  trophies: {
    cleanSheets: 10,
    divisionEight: 1,
    divisionSeven: 0,
    divisionSix: 2,
    divisionFive: 4,
    divisionFour: 3,
    divisionThree: 5,
    divisionTwo: 6,
    divisionOne: 7,
    goldenBoot: 2,
    goldenGlove: 3,
    mostAssists: 4,
    mostHeaders: 5,
    mostIntercepts: 6,
    mostPasses: 7,
    mostTackles: 8,
    vgcdOr: 9,
  },
};
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
    console.log(res);
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
    await login(req, res, next);
    expect(res.body.user).toHaveProperty("username", mockUser.username);
  });
});
