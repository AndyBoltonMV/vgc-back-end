const express = require("express");
const cors = require("cors");
const { errorHandler, dbConnectionMiddleware } = require("./middleware");
const { userRouter, teamRouter, leagueRouter } = require("./routes");
const { origin, uri } = require("./config");

const app = express();

app
  .use(cors({ origin }))
  .use(express.json())
  .use(dbConnectionMiddleware(uri))
  .use((err, req, res, next) => {
    if (err) errorHandler(err, req, res, next);
  })
  .use("/user", userRouter)
  .use("/team", teamRouter)
  .use("/league", leagueRouter);

module.exports = app;
