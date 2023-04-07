const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { secret, userSanitize } = require("../config");

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      throw new Error("500 Unable to create new User");
    } else {
      res.status(200).send({ user: user.username });
    }
  } catch (error) {
    next(error);
  }
};

exports.readUser = async (req, res, next) => {
  try {
    const result = await User.findOne(req.body.filter);
    if (!user) {
      throw new Error("404 No user found");
    } else {
      const user = userSanitize(result);
      res.status(200).send(user);
    }
  } catch (error) {
    next(error);
  }
};

exports.readUsers = async (req, res, next) => {
  try {
    const results = await User.find(req.body.filter);
    if (!results) {
      throw new Error("404 No users found");
    } else {
      const users = results.map(userSanitize);
      res.status(200).send({ users });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = userSanitize(req.user);
    const token = jwt.sign({ id: user._id }, secret);
    res.status(200).send({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.genericUpdate = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body.update,
      { new: true }
    );
    if (!updated) {
      throw new Error("404 User not found");
    } else if (updated.nModified === 0) {
    }
  } catch (error) {
    next(error);
  }
};
