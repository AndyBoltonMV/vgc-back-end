const { userSanitize } = require("../../../src/config");
const { mockUser } = require("../../../__mocks__/data.mock");

describe("userSanitize", () => {
  it("should remove password and email properties from user object", () => {
    const result = userSanitize(mockUser);
    expect(result.password).toEqual("");
    expect(result.email).toEqual("");
  });
});
