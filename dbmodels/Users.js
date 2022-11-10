const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      hashedPassword: {
        type: DataTypes.STRING(64).BINARY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Users",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Users",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
