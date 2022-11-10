const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Logs",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Cars",
          key: "id",
        },
      },
      mileage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "Logs",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Logs",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
