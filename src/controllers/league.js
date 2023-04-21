const { League, Fixture, Team } = require("../models");

exports.createLeague = async (req, res, next) => {
  try {
    const league = await League.create(req.body);
    res.status(201).send(league);
  } catch (error) {
    next(error);
  }
};

exports.getAllLeagues = async (req, res, next) => {
  try {
    const leagues = await League.find();
    res.status(200).send(leagues);
  } catch (error) {
    next(error);
  }
};

exports.getLeagueById = async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      throw new Error("404 League not found");
    }
    res.status(200).send(league);
  } catch (error) {
    next(error);
  }
};

exports.updateLeagueGeneric = async (req, res, next) => {
  try {
    const league = await League.findByIdAndUpdate(
      req.params.id,
      req.body.updateObj,
      {
        new: true,
      }
    );
    if (!league) {
      throw new Error("404 League not found");
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

exports.addFixtures = async (req, res, next) => {
  try {
    let updateObj;
    if (req.body.remove) {
      updateObj = {
        $pull: { fixtures: req.body.fixtureId },
      };
    } else {
      const fixture = await Fixture.create(req.body.fixture);
      updateObj = {
        $push: { fixtures: fixture._id },
      };
    }
    const updated = await League.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 League not found");
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateFixtures = async (req, res, next) => {
  try {
    const updated = await Fixture.findByIdAndUpdate(
      req.params.id,
      req.body.updateObj,
      {
        new: true,
      }
    );
    if (!updated) {
      throw new Error("404 fixture not found");
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateTeams = async (req, res, next) => {
  try {
    const team = await Team.findOne({ _id: req.body.teamId });
    if (!team) {
      throw new Error("404 team or league not found");
    }
    let updateObj;
    if (req.body.remove) {
      updateObj = {
        $pull: { teams: team._id, teamNames: team.name },
      };
    } else {
      updateObj = {
        $push: { teams: team._id, teamNames: team.name },
      };
    }
    const updated = await League.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 team or league not found");
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteLeague = async (req, res, next) => {
  try {
    const league = await League.findByIdAndDelete(req.params.id);
    if (!league) {
      throw new Error("404 League not found");
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
