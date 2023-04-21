const { MongoMemoryServer } = require("mongodb-memory-server");
const uri =
  process.env.URI ||
  (process.env.NODE_ENV === "development"
    ? new MongoMemoryServer().getUri()
    : undefined);

module.exports = {
  rounds: Number(process.env.ROUNDS) || 1,
  secret: process.env.SECRET || "placeholder",
  origin: process.env.ORIGIN || "http://localhost:3000",
  uri,
  userSanitize: require("./util").userSanitize,
  logger: require("./util").logger,
  connection: require("./db").connection,
};
