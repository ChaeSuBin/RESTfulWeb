import express from "express";
import sequelize from "sequelize";
import cors from "cors";
import { Teams, Players, TeamPlayers } from "./models.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3039;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    res.send("wow");
});
app.get("/teamscount", async(req, res) => {
  const rows = await Teams.findOne({
    attributes: [
      // count(id) as 'countRow'
      [sequelize.fn('COUNT', sequelize.col('id')), 'countRow'],
    ]
  });
  res.json(rows);
});
app.get("/teamsview", async (req, res) => {
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const ideas = await Teams.findAndCountAll({
    order: [[sequelize.literal("id"), "DESC"]],
    limit,
    offset,
  });
  res.json(ideas.rows);
});
app.get("/playerview/:playerid", async (req, res) => {
  const player = await Players.findOne({
    where: { id: req.params.playerid },
  });
  console.log('v: ', player);
  res.json(player);
});
app.get("/teamsuser/:ideaid", async (req, res) => {
  const ideas = await TeamPlayers.findAll({
    where: { teamId: req.params.ideaid },
    //order: [[sequelize.literal("id"), "DESC"]],
  });
  console.log('v: ', ideas);
  res.json(ideas);
});
app.put("/joinidea", async(req, res) => {
  const team = await Teams.findOne({
    where: { origin: req.body.origin },
  });
  if(team != null){
    team.hash = req.body.hash;
    team.description = req.body.desc;
    await team.save();
  }
  // const team = await Teams.update(
  //   { hash: req.body.hash, description: req.body.desc },
  //   { where: {origin: req.body.origin} }
  // );
  const [player, pcreated] = await Players.findOrCreate({
    where: { sub: req.body.useraddr },
    defaults: {
      nickname: req.body.username,
      token: 0,
    },
  });
  if (!pcreated) {
    player.nickname = req.body.username;
    await player.save();
  }

  await player.addTeams(team, { through: { selfGranted: false } });
  const result = await Players.findOne({
    where: { sub: req.body.useraddr },
    include: Teams,
  });
  console.log(result);
})
app.post("/ideacreate", async(req, res) => {
  //console.log('sv', req.body.useraddr);
  const [team, created] = await Teams.findOrCreate({
    where: { hash: req.body.hash },
    defaults: {
      title: req.body.name,
      description: req.body.desc,
      origin: req.body.hash,
      ideaToken: 0,
    },
  });
  if (!created) {
    // team.nickname = req.body.username;
    // await team.save();
    console.log('---------team');
  }

  const [player, pcreated] = await Players.findOrCreate({
    where: { sub: req.body.useraddr },
    defaults: {
      nickname: req.body.username,
      token: 0,
    },
  });
  if (!pcreated) {
    player.nickname = req.body.username;
    await player.save();
  }

  await player.addTeams(team, { through: { selfGranted: false } });
  const result = await Players.findOne({
    where: { sub: req.body.useraddr },
    include: Teams,
  });
  console.log(result);
});
// app.post("/usercheck", async(req, res) => {
//   const [player, created] = await Players.findOrCreate({
//     where: { sub: req.body.hash },
//     defaults: {
//       nickname: req.body.name,
//       token: req.body.desc,
//     },
//   });
//   if (!created) {
//     // team.nickname = req.body.username;
//     // await team.save();
//     console.log('---------creted');
//   }
// });