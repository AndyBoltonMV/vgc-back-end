const jwt = require("jsonwebtoken");
const { User, Contract } = require("../models");
const { secret, userSanitize } = require("../config");

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      throw new Error("500 Unable to create new User");
    } else {
      req.response = {
        status: 200,
        body: {
          user: user.username,
        },
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.readUser = async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id);
    if (!result) {
      throw new Error("404 No user found");
    } else {
      const user = userSanitize(result);
      req.response = {
        status: 200,
        body: {
          user,
        },
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.readUsers = async (req, res, next) => {
  try {
    const results = await User.find(req.query);
    if (!results) {
      throw new Error("404 No users found");
    } else {
      const users = results.map(userSanitize);
      req.response = {
        status: 200,
        body: {
          users,
        },
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = userSanitize(req.user);
    const token = jwt.sign({ id: user._id }, secret);
    req.response = {
      status: 200,
      body: {
        user,
        token,
      },
    };
    next();
  } catch (error) {
    next(error);
  }
};

exports.genericUpdate = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body.updateObj,
      { new: true }
    );
    if (!updated) {
      throw new Error("404 User not found");
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

exports.updateLeague = async (req, res, next) => {
  try {
    let updateObj = {
      $push: { leagues: req.body.leagueId },
    };
    if (req.body.remove) {
      updateObj = {
        $pull: { leagues: req.body.leagueId },
      };
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 User not found");
    } else {
      req.response = {
        status: 200,
        body: {},
      };
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateContract = async (req, res, next) => {
  try {
    let updateObj;
    if (req.body.remove) {
      updateObj = {
        $pull: { contractOffers: req.body.contractId },
      };
    } else {
      const contract = await Contract.create(req.body.contract);
      updateObj = {
        $push: { contractOffers: contract._id },
      };
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!updated) {
      throw new Error("404 User not found");
    } else {
      req.response = {
        status: 200,
        body: {},
      };
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      throw new Error("404 User not found");
    } else {
      req.response = {
        status: 200,
        body: {},
      };
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};
