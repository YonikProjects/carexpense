var initModels = require("./init-models");
const sequelize = require("./sequelize");
const models = initModels(sequelize);
module.exports = models;
