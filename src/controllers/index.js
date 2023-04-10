const {
  createUser,
  readUser,
  readUsers,
  login,
  genericUpdate,
  updateLeague,
  updateContract,
  deleteUser,
} = require("./user");
const {
  createTeam,
  getTeamById,
  getTeams,
  updateTeam,
  updateRoster,
  updateLineup,
  deleteTeam,
} = require("./team");

module.exports = {
  createUser,
  readUser,
  readUsers,
  login,
  genericUpdate,
  updateLeague,
  updateContract,
  deleteUser,
  createTeam,
  getTeamById,
  getTeams,
  updateTeam,
  updateRoster,
  updateLineup,
  deleteTeam,
};
