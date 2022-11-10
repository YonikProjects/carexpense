const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProlongedExpense', {
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
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ProlongedExpense',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_ProlongedExpense",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
