const { logger } = require("../config");

exports.errorHandler = (err, req, res, next) => {
  const errorParts = err.message.split(" ");
  const statusCode = parseInt(errorParts[0]);
  const errorMessage = errorParts.slice(1).join(" ");

  logger.error(`${statusCode} ${errorMessage}`);
  res.status(statusCode).send(errorMessage);
};
