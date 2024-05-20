import { DataTypes } from "sequelize";
import db from "../config/db-config.js";

const Users = db.define(
  "users",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
  }
);

export default Users;
