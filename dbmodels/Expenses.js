const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Expenses",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      logId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Logs",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(18, 0),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Expenses",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Expenses",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
