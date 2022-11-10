const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Refuels",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      expenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Expenses",
          key: "id",
        },
      },
      liters: {
        type: DataTypes.DECIMAL(18, 0),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Refuels",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Refuels",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
