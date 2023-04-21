require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
let uri;
const saveURI = async () => {
  if (process.env.NODE_ENV === "development") {
    const fakeDb = await MongoMemoryServer.create();
    uri = fakeDb.getUri();
  } else {
    uri = process.env.URI;
  }
  return uri;
};

module.exports = {
  rounds: Number(process.env.ROUNDS) || 1,
  secret: process.env.SECRET || "placeholder",
  origin: process.env.ORIGIN || "http://localhost:3000",
  userSanitize: require("./util").userSanitize,
  logger: require("./util").logger,
  connection: require("./db").connection,
  saveURI,
};
