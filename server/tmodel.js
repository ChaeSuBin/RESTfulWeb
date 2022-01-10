import { sequelize, Players, Teams, TeamPlayers } from "./models.js";

//await sequelize.sync({ force: true }); //all table initilizing

// (async()=>{
//     await Players.sync({ force: true});
//     const user = await Players.create({
//       sub : 'alice',
//       nickname : 'husigi',
//       token : 2,
//     });
//     const rows = await sequelize.query('select * from Players');
//     console.log(rows);
// })();

// await TeamPlayers.sync({ force: true });
// await Players.sync({ force: true });
// await Teams.sync({ force: true });

//----------------------------------------2
// const dumy = {
//   hash : 'testhash',
//   title : 'testtitle',
//   description : 'dumydesc',
//   userId : 1,
// }
// const dumyPlayer = {
//     sub : 'testaddr1',
//     nickname : 'testname1',
//     token : 0,
// }

// const amidala = await Players.create(dumyPlayer);
// const [team, created] = await Teams.findOrCreate({
//     where: { hash: 'testhash0x' },
//     defaults: {
//         title : 'testtitle',
//         description : 'dumydesc',
//         origin: 'testhash0x',
//         userId : 1,
//     },
// });
// if (created) {
//     console.log('!---------crted');
// }

// await amidala.addTeams(team, { through: { selfGranted: false } });
// const result = await Players.findOne({
//   where: { sub: '0xp4dm3' },
//   include: Teams,
// });
// console.log(result);
//----------------------------------3

// const team = await Teams.findOne({
//     where: { origin: '0xtesthash' },
// });
// console.log('v: ', team);
// if(team == null){
//     console.log('yes');
// }
//----------------------------------4
let addr = [];

const counter = await TeamPlayers.count({
    where: {teamId : 1},
})
console.log('v: ', counter);

const findUsers = await TeamPlayers.findAll({
    where: {teamId : 1},
})
await Teams.findByPk(findUsers[0].teamId).then(hash => {
    //console.log('o ', getOrigin.origin);
    addr.push(hash.origin);
})

let iter = 0;
while(iter != counter){
    await Players.findByPk(iter + 1).then(user => {
        //console.log('tm ', user.sub);
        addr.push(user.sub);
    });
    console.log('u: ', findUsers[iter].playerId);
    ++iter;
}
console.log('r ', addr);
//res.json(counter.rows);