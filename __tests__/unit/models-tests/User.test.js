const { Error } = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { User } = require("../../../src/models");

beforeAll(async () => {
  await setUpDb();
});

afterEach(async () => {
  await sanitizeDb();
});

afterAll(async () => {
  await destroyDb();
});

describe("User Model Test", () => {
  it("should save a user successfully", async () => {
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("testuser@example.com");
    expect(savedUser.password).toBe("testpassword");
    expect(savedUser.isManager).toBeFalsy();
    expect(savedUser.xboxName).toBeUndefined();
    expect(savedUser.psName).toBeUndefined();
    expect(savedUser.youtube).toBeUndefined();
    expect(savedUser.twitch).toBeUndefined();
    expect(savedUser.playstation).toBeUndefined();
    expect(savedUser.position).toBeUndefined();
    expect(savedUser.membership).toBeUndefined();
    expect(savedUser.profileImage).toBeUndefined();
    expect(savedUser.leagues).toHaveLength(0);
    expect(savedUser.contractOffers).toHaveLength(0);
    expect(savedUser.trophies).toMatchObject({
      cleanSheets: undefined,
      divisionEight: undefined,
      divisionSeven: undefined,
      divisionSix: undefined,
      divisionFive: undefined,
      divisionFour: undefined,
      divisionThree: undefined,
      divisionTwo: undefined,
      divisionOne: undefined,
      goldenBoot: undefined,
      goldenGlove: undefined,
      mostAssists: undefined,
      mostHeaders: undefined,
      mostIntercepts: undefined,
      mostPasses: undefined,
      mostTackles: undefined,
      vgcdOr: undefined,
    });
  });

  it("should fail to save a user without required fields", async () => {
    const user = new User({
      username: "testuser",
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});
