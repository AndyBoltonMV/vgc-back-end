const router = require("express").Router();
const {
  createLeague,
  getAllLeagues,
  getLeagueById,
  updateLeagueGeneric,
  addFixtures,
  updateFixtures,
  updateTeams,
  deleteLeague,
} = require("../controllers");

router
  .post("/", createLeague)
  .get("/", getAllLeagues)
  .get("/:id", getLeagueById)
  .put("/:id", updateLeagueGeneric)
  .put("/add-fixture/:id", addFixtures)
  .put("/update-fixture/:id", updateFixtures)
  .put("/update-teams/:id", updateTeams)
  .delete("/:id", deleteLeague);

module.exports = router;
