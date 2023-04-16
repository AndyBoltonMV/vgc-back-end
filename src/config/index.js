module.exports = {
  rounds: Number(process.env.ROUNDS) || 1,
  secret: process.env.SECRET || "placeholder",
  userSanitize: require("./util").userSanitize,
  logger: require("./util").logger,
};
