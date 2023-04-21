const router = require("express").Router();
const {
  createUser,
  readUser,
  readUsers,
  login,
  genericUpdate,
  updateLeague,
  updateContract,
  deleteUser,
} = require("../controllers");
const { hashPassword, checkPassword, checkToken } = require("../middleware");

router
  .post("/", hashPassword, createUser)
  .get("/:id", readUser)
  .get("/", readUsers)
  .post("/login", checkPassword, login)
  .get("/login/token", checkToken, login)
  .put("/:id", hashPassword, genericUpdate)
  .put("/update-league/:id", updateLeague)
  .put("/update-contract/:id", updateContract)
  .delete("/:id", checkToken, deleteUser);

module.exports = router;
