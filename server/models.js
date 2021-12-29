import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const sequelize = new Sequelize(
    "tempdb",      //DB名
    "postgres",      //ユーザー名
    "password",     //パスワード
    {
      dialect: "postgres"   //DBの製品名
    }
);

export const Players = sequelize.define("players", {
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const Teams = sequelize.define(
  "teams",
  {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideaToken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { underscored: true },
);

export const TeamPlayers = sequelize.define('team_play',
 {}, { timestamps: false }
);

Players.belongsToMany(Teams, { through: TeamPlayers });
Teams.belongsToMany(Players, { through: TeamPlayers });