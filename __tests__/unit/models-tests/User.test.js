const { Error } = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { User } = require("../../../src/models");
const { mockUser } = require("../../../__mocks__/data.mock");

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
    const user = new User(mockUser);
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("testuser@example.com");
    expect(savedUser.password).toBe("testpassword");
    expect(savedUser.isManager).toBeFalsy();
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
