const router = require("express").Router();
const {
  createTeam,
  getTeamById,
  getTeams,
  updateTeam,
  updateRoster,
  updateLineup,
  deleteTeam,
} = require("../controllers");

router
  .post("/", createTeam)
  .get("/", getTeams)
  .get("/:id", getTeamById)
  .put("/:id", updateTeam)
  .put("/update-roster/:id", updateRoster)
  .put("/update-lineup/:id", updateLineup)
  .delete("/:id", deleteTeam);

module.exports = router;
