const mongoose = require("mongoose");
const {
  setUpDb,
  sanitizeDb,
  destroyDb,
} = require("../../../__mocks__/db.mock");
const { Contract } = require("../../../src/models");

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
    const contractData = {
      continent: "Europe",
      time: "2022-01-01T12:00:00.000Z",
      manager: "John Doe",
      console: "PlayStation 5",
      length: 12,
      teamName: "Team A",
      divisionLogo: "https://example.com/division-logo.png",
    };
    const contract = new Contract(contractData);
    const savedContract = await contract.save();
    expect(savedContract._id).toBeDefined();
    expect(savedContract.continent).toBe(contractData.continent);
    expect(savedContract.time.toISOString()).toBe(contractData.time);
    expect(savedContract.manager).toBe(contractData.manager);
    expect(savedContract.console).toBe(contractData.console);
    expect(savedContract.length).toBe(contractData.length);
    expect(savedContract.teamName).toBe(contractData.teamName);
    expect(savedContract.image).toBeUndefined();
    expect(savedContract.divisionLogo).toBe(contractData.divisionLogo);
    expect(savedContract.managerImage).toBeUndefined();
  });

  it("should fail to save a contract with a missing required field", async () => {
    const contractData = {
      continent: "Europe",
      time: "2022-01-01T12:00:00.000Z",
      manager: "John Doe",
      console: "PlayStation 5",
      length: 12,
      divisionLogo: "https://example.com/division-logo.png",
    };
    const contract = new Contract(contractData);
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
    const contractData = {
      continent: "Europe",
      time: "2022-01-01T12:00:00.000Z",
      manager: "John Doe",
      console: "PlayStation 5",
      length: 12,
      teamName: "Team A",
      divisionLogo: "https://example.com/division-logo.png",
    };
    const contract = new Contract(contractData);
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
