const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RecurringExpenses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expenseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Expenses',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'RecurringExpenses',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_RecurringExpenses",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
