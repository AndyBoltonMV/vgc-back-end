const { Team } = require("../models");

exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    req.response = {
      status: 200,
      body: team,
    };
    next();
  } catch (error) {
    next(error);
  }
};

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find(req.body.filterObj);
    req.response = {
      status: 200,
      body: teams,
    };
    next();
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
    req.response = {
      status: 200,
      body: team,
    };
    next();
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
    req.response = {
      status: 200,
      body: {},
    };
    next();
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
      req.response = {
        status: 200,
        body: updated,
      };
      next();
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
      req.response = {
        status: 200,
        body: {},
      };
      next();
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
    req.response = {
      status: 204,
      body: team,
    };
    next();
  } catch (error) {
    next(error);
  }
};
