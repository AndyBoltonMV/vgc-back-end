const { logger } = require("../config");

exports.errorHandler = (err, req, res, next) => {
  const errorParts = err.message.split(" ");
  let statusCode = parseInt(errorParts[0]);
  if (!statusCode) statusCode = 500;
  const errorMessage = errorParts.slice(1).join(" ");

  logger.error(`${statusCode} ${errorMessage}`);
  res.status(statusCode).send(errorMessage);
};
