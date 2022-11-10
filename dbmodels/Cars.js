const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Cars",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      manufacturer: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      model: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Cars",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Cars",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
