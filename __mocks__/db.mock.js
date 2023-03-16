// Package imports
const { connect, disconnect, modelNames, model } = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Global variable for mocked db
let mongoServer;

// Function to be run in beforeAll Jest set up method
exports.setUpDb = async function () {
  mongoServer = await MongoMemoryServer.create(); // Create in memory db
  await connect(mongoServer.getUri()); // Open Mongoose connection to mocked db
};

// Function to be run in the afterEach Jest set up method
exports.sanitizeDb = async function () {
  const models = modelNames(); // Get all model names in current mocked db

  // Loop through model names and remove all db entries for each model
  for (const modelName of models) {
    await model(modelName).deleteMany({});
  }
};

// Function to be run in the afterAll Jest tear down method
exports.destroyDb = async function () {
  await disconnect(); // Stop connection through Mongoose
  mongoServer.stop(); // Destroy mocked db
};
