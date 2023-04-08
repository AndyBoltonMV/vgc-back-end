const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { Contract } = require("../../../src/models");
const { mockContract } = require("../../../__mocks__/data.mock");

beforeAll(async () => {
  await setUpDb();
});

afterEach(async () => {
  await sanitizeDb();
});

afterAll(async () => {
  await destroyDb();
});

describe("Contract Model", () => {
  it("should create and save a contract successfully", async () => {
    const contract = new Contract(mockContract);
    const savedContract = await contract.save();
    expect(savedContract._id).toBeDefined();
    expect(savedContract.continent).toBe(mockContract.continent);
    expect(savedContract.time).toBe(mockContract.time);
    expect(savedContract.manager).toBe(mockContract.manager);
    expect(savedContract.console).toBe(mockContract.console);
    expect(savedContract.length).toBe(mockContract.length);
    expect(savedContract.teamName).toBe(mockContract.teamName);
    expect(savedContract.image).toBeUndefined();
    expect(savedContract.divisionLogo).toBe(mockContract.divisionLogo);
    expect(savedContract.managerImage).toBeUndefined();
  });

  it("should fail to save a contract with a missing required field", async () => {
    let brokenContract = JSON.parse(JSON.stringify(mockContract));
    delete brokenContract.teamName;
    const contract = new Contract(brokenContract);
    let error;
    try {
      await contract.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.teamName).toBeDefined();
  });

  it("should update an existing contract successfully", async () => {
    const contract = new Contract(mockContract);
    await contract.save();
    const updatedContractData = {
      teamName: "Team B",
    };
    const updatedContract = await Contract.findByIdAndUpdate(
      contract._id,
      updatedContractData,
      { new: true }
    );
    expect(updatedContract.teamName).toBe(updatedContractData.teamName);
  });
});
