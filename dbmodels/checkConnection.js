const { Sequelize } = require("sequelize");
const sequelize = require("./sequelize");

async function checkConnection() {
  process.stdout.write("connecting to db\r");
  await sequelize
    .authenticate()
    .then(() => {
      process.stdout.write(`db connection success\n`);
    })
    .catch((err) => {
      process.stdout.write(`db connection fail\n`);
      throw new Error(err);
    });
}
exports.checkConnection = checkConnection;
