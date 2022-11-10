const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ownerships', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cars',
        key: 'id'
      }
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'Ownerships',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Ownerships",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
