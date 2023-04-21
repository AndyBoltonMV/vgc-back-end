const { verify } = require("jsonwebtoken");
const { hash, genSalt, compare } = require("bcryptjs");
const { rounds, secret } = require("../config");
const { User } = require("../models");

exports.hashPassword = async (req, res, next) => {
  try {
    const salt = await genSalt(rounds);
    if (req.body.updateObj && req.body.updateObj.password) {
      req.body.updateObj.password = await hash(
        req.body.updateObj.password,
        salt
      );
    } else if (req.body.password) {
      req.body.password = await hash(req.body.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkPassword = async (req, res, next) => {
  try {
    req.user = await User.findOne({ username: req.body.username });
    if (req.user && (await compare(req.body.password, req.user.password))) {
      next();
    } else {
      throw new Error("404 No user found");
    }
  } catch (error) {
    next(error);
  }
};

exports.checkToken = async (req, res, next) => {
  try {
    const token = verify(
      req.header("Authorization").replace("Bearer ", ""),
      secret
    );
    req.user = await User.findById(token._id);
    if (!req.user) {
      throw new Error("404 No user found");
    }
    next();
  } catch (error) {
    next(error);
  }
};
