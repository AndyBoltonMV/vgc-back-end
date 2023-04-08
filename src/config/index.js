module.exports = {
  salt: process.env.SALT || "1",
  secret: process.env.SECRET || "placeholder",
  userSanitize: require("./util").userSanitize,
};
