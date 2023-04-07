const { User } = require("../models");

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
