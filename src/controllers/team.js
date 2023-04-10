const Team = require("../models/team");

exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).send(team);
  } catch (error) {
    next(error);
  }
};

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find(req.body.filterObj);
    res.status(200).send(teams);
  } catch (error) {
    next(error);
  }
};

exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      throw new Error("404 Team not found");
    }
    res.status(200).send(team);
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body.updateObj,
      {
        new: true,
      }
    );
    if (!team) {
      throw new Error("404 Team not found");
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

exports.updateRoster = async (req, res, next) => {
  try {
    let updateObj = {
      $push: { roster: req.body.userId },
    };
    if (req.body.remove) {
      updateObj = { $pull: { roster: req.body.userId } };
    }
    const updated = await Team.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 Team not found");
    } else {
      res.status(200).send(updated);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateLineup = async (req, res, next) => {
  try {
    let updateObj = {
      $push: { lineup: req.body.userId },
    };
    if (req.body.remove) {
      updateObj = { $pull: { lineup: req.body.userId } };
    }
    const updated = await Team.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 Team not found");
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      throw new Error("404 Team not found");
    }
    res.status(204).send(team);
  } catch (error) {
    next(error);
  }
};
