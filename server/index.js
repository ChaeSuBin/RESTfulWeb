import express from "express";
import sequelize from "sequelize";
import cors from "cors";
import { Teams, Players, TeamPlayers, Holds } from "./models.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3039;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    res.send("(╯°ㅁ°)╯︵┻━┻");
});
app.get("/ideaPoint/:teamid", async(req, res) => {
  const result = await TeamPlayers.findAll({
    where: { teamId: req.params.teamid },
    //include: Teams,
  });
  
  let iter = 0;
  let ideaPoint = [];
  while(result.length != iter){
    ideaPoint.push(result[iter].status);
    ++iter;
  }
  res.json(ideaPoint);
});
app.get("/alert/:origin", async(req, res) => {
  const hold = await Holds.findOne({
    where: { origin: req.params.origin },
  });
  if(hold == null){
      console.log('not found..');
  }
  else{
    res.json(hold);
  }
});
app.get("/teamplayers/:teamid", async(req, res) => {
  let addr = [];
  const counter = await TeamPlayers.count({
    where: {teamId : req.params.teamid},
  });
  const findUsers = await TeamPlayers.findAll({
      where: {teamId : req.params.teamid},
  });
  await Teams.findByPk(findUsers[0].teamId).then(hash => {
    //console.log('o ', getOrigin.origin);
    addr.push(hash.origin);
  });
  let iter = 0;
  while(iter != counter){
    await Players.findByPk(findUsers[iter].playerId).then(user => {
      //console.log('tm ', user.sub);
      addr.push(user.sub);
    });
    console.log('u: ', findUsers[iter].playerId);
    ++iter;
  }
  res.json(addr);
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
app.get("/oneidea/:teamid", async (req, res) => {
  const idea = await Teams.findOne({
    where: { id: req.params.teamid },
  });
  res.json(idea);
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
app.get("/playteams/:playerid", async (req, res) => {
  let items = [];
  const tid = await TeamPlayers.findAll({
    where: { playerId: req.params.playerid}
  });
  
  for(let iter = 0; iter < tid.length; ++iter){
    items.push(tid[iter].teamId);
  }
  res.json(items);
})
// app.get("/allplayercount", async (req, res) => {
//   await Players.count().then(rows => {
//     res.json(rows);
//   });
// })
app.get("/playerview/:playerid", async (req, res) => {
  const player = await Players.findOne({
    where: { id: req.params.playerid },
  });
  console.log('v: ', player);
  res.json(player);
});
app.get("/playerid/:playeraddr", async (req, res) => {
  await Players.findOne({
    where: {sub: req.params.playeraddr}
  }).then(pid => {
    res.json(pid);
  });
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
    team.ideaToken += 1;
    await team.save();
  }
  // const team = await Teams.update(
  //   { hash: req.body.hash, description: req.body.desc },
  //   { where: {origin: req.body.origin} }
  // );
  const player = await Players.findOne({
    where: { id: req.body.userid }
  });
  await player.addTeams(team, { through: { status: req.body.stake }});
  
  const result = await Players.findOne({
    where: { sub: req.body.userid },
    include: Teams,
  });
  console.log('av: ', req.body.userid);
  console.log(result);
});
app.post("/requirejoin", async(req, res) => {
  const reqTeam = {
  hash : req.body.hash,
  title : req.body.name,
  description : req.body.desc,
  origin: req.body.origin,
  reqstake: req.body.putstake,
  userId : req.body.userid,
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

const [team, created] = await Holds.findOrCreate({
    where: { hash: req.body.hash },
    defaults: reqTeam,
});
if (created) {
    console.log('o---------crted');
}
});
app.post("/ideacreate", async(req, res) => {
  //console.log('sv', req.body.useraddr);
  const [team, created] = await Teams.findOrCreate({
    where: { hash: req.body.hash },
    defaults: {
      title: req.body.name,
      description: req.body.desc,
      origin: req.body.hash,
      ideaToken: 0,
      blocked: false,
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

  await player.addTeams(team, { through: { status: 100 }});
  const result = await Players.findOne({
    where: { sub: req.body.useraddr },
    include: Teams,
  });
  console.log(result);
});
app.post("/regiplayer", async(req, res) => {
  await Players.create({
    sub: req.body.addr,
    nickname: 'auto',
    token: 0,
  });
});
app.delete("/dlthold/:holdId", async(req, res) => {
  await Holds.destroy({
    where: {id: req.params.holdId}
  })
  console.log('o------destroyed')
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