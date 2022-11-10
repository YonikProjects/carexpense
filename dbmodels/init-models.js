var DataTypes = require("sequelize").DataTypes;
var _Cars = require("./Cars");
var _Expenses = require("./Expenses");
var _Logs = require("./Logs");
var _Ownerships = require("./Ownerships");
var _ProlongedExpense = require("./ProlongedExpense");
var _RecurringExpenses = require("./RecurringExpenses");
var _Refuels = require("./Refuels");
var _Users = require("./Users");

function initModels(sequelize) {
  var Cars = _Cars(sequelize, DataTypes);
  var Expenses = _Expenses(sequelize, DataTypes);
  var Logs = _Logs(sequelize, DataTypes);
  var Ownerships = _Ownerships(sequelize, DataTypes);
  var ProlongedExpense = _ProlongedExpense(sequelize, DataTypes);
  var RecurringExpenses = _RecurringExpenses(sequelize, DataTypes);
  var Refuels = _Refuels(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  // Ownerships.hasOne(Users, { foreignKey: "id", as: "owner" });
  // Users.hasMany(Ownerships, { foreignKey: "userId", as: "owns" });
  // Users.belongsToMany(Cars, { through: "Ownerships", as: "cars" });
  // Cars.belongsToMany(Users, { through: "Ownerships", as: "users" });
  // Ownerships.hasOne(Cars, { foreignKey: "id", as: "car" });
  // Cars.hasMany(Ownerships, { foreignKey: "carId", as: "ownership" });

  Ownerships.belongsTo(Users, { foreignKey: "userId", as: "owner" });
  Users.hasMany(Ownerships, { foreignKey: "userId", as: "owns" });
  Users.belongsToMany(Cars, { through: "Ownerships", as: "cars" });
  Cars.belongsToMany(Users, { through: "Ownerships", as: "users" });
  Ownerships.belongsTo(Cars, { foreignKey: "carId", as: "car" });
  Cars.hasMany(Ownerships, { foreignKey: "carId", as: "ownership" });
  Cars.hasMany(Logs, { as: "logs", foreignKey: "carId" });
  Logs.belongsTo(Cars, { as: "car", foreignKey: "carId" });
  Expenses.belongsTo(Logs, { as: "log", foreignKey: "logId" });
  Logs.hasOne(Expenses, { as: "expenses", foreignKey: "logId" });

  Users.hasMany(Logs, { foreignKey: "userId", as: "logs" });
  Logs.belongsTo(Users, { foreignKey: "userId", as: "user" });

  ProlongedExpense.belongsTo(Expenses, {
    as: "expense",
    foreignKey: "expenseId",
  });
  Expenses.hasOne(ProlongedExpense, {
    as: "prolongedExpenses",
    foreignKey: "expenseId",
  });
  RecurringExpenses.belongsTo(Expenses, {
    as: "expense",
    foreignKey: "expenseId",
  });
  Expenses.hasOne(RecurringExpenses, {
    as: "recurringExpenses",
    foreignKey: "expenseId",
  });
  Refuels.belongsTo(Expenses, { as: "expense", foreignKey: "expenseId" });
  Expenses.hasOne(Refuels, { as: "refuels", foreignKey: "expenseId" });

  return {
    Cars,
    Expenses,
    Logs,
    Ownerships,
    ProlongedExpense,
    RecurringExpenses,
    Refuels,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
