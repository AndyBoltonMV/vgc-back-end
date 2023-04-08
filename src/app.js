const { readUser } = require("./controllers");
const { setUpDb, destroyDb } = require("../__mocks__/db.mock");
const { User } = require("./models");

let req = { body: {} };
let res = {};

req.body.filter = {};

(async () => {
  await setUpDb();
  await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword",
    isManager: false,
    xboxName: "TestXboxName",
    psName: "TestPSName",
    youtube: "TestYoutubeChannel",
    twitch: "TestTwitchChannel",
    playstation: "TestPlaystation",
    position: "TestPosition",
    membership: "TestMembership",
    profileImage: "https://example.com/testuser.jpg",
    leagues: ["609b60ebd100e033048cbc2b", "609b60ebd100e033048cbc2c"],
    contractOffers: ["609b60ebd100e033048cbc2d", "609b60ebd100e033048cbc2e"],
    trophies: {
      cleanSheets: 10,
      divisionEight: 1,
      divisionSeven: 0,
      divisionSix: 2,
      divisionFive: 4,
      divisionFour: 3,
      divisionThree: 5,
      divisionTwo: 6,
      divisionOne: 7,
      goldenBoot: 2,
      goldenGlove: 3,
      mostAssists: 4,
      mostHeaders: 5,
      mostIntercepts: 6,
      mostPasses: 7,
      mostTackles: 8,
      vgcdOr: 9,
    },
  });

  await readUser(req, res);
  await destroyDb();
})();
