const winston = require("winston");
const { join } = require("path");

exports.userSanitize = (user) => {
  user.password = "";
  user.email = "";
  return user;
};

exports.logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: join(__dirname, "../../logs/error.log"),
    }),
  ],
});
