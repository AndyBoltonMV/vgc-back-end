const express = require("express");
const cors = require("cors");
const {
  errorHandler,
  dbConnectionMiddleware,
  dbDisconnect,
} = require("./middleware");
const { userRouter, teamRouter, leagueRouter } = require("./routes");
const { origin } = require("./config");

const app = express();

app
  .use(cors({ origin }))
  .use(express.json())
  .use(dbConnectionMiddleware)
  .use("/user", userRouter)
  .use("/team", teamRouter)
  .use("/league", leagueRouter)
  .use(dbDisconnect)
  .use((req, res, next) => {
    try {
      res.status(req.response.status).send(req.response.body);
    } catch (error) {
      next(error);
    }
  })
  .use((err, req, res, next) => {
    if (err) errorHandler(err, req, res, next);
  });

module.exports = app;
