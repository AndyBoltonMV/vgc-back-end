require("dotenv").config();

module.exports = {
  salt: process.env.SALT,
  secret: process.env.SECRET,
  userSanitize: require("./util").userSanitize,
};
