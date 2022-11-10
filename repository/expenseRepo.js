const db = require("../dbmodels/db");
const sequelize = require("../dbmodels/sequelize");
const { Op } = require("sequelize");
const sendError = require("../routes/handlers");
const jwt = require("jsonwebtoken");
const { Ownerships } = require("../dbmodels/db");
function subtractYears(numOfYears, date = new Date()) {
  date.setFullYear(date.getFullYear() - numOfYears);
  return date;
}

async function getUser(req) {
  const user = await db.Users.findOne({
    where: { email: req.user.email },
  });
  return await user;
}
async function checkOwnership(req) {
  const user = await getUser(req);
  const car = await db.Ownerships.findOne({
    where: { carId: req.body.car.id, userId: user.id, isAccepted: true },
  });
  if (car === null) return false;
  else return true;
}

async function createLogAndExpense(req) {
  let log, expense;
  let user = await getUser(req);
  let mileage = null;
  try {
    let date;
    if (!req.body.date && !req.body.dateRange) {
      date = new Date();
      mileage = req.body.mileage;
    } else if (req.body.dateRange) {
      date = new Date(Date.parse(req.body.dateRange[0].split("T")[0]));
    } else {
      date = new Date(Date.parse(req.body.date.split("T")[0]));
    }
    log = await db.Logs.create({
      carId: req.body.car.id,
      mileage: mileage,
      userId: user.id,
    });

    expense = await db.Expenses.create({
      logId: log.id,
      name: req.body.name,
      price: req.body.price,
      date: date,
    });
    return [await log, await expense];
  } catch (err) {
    if (expense) await expense.destroy();
    if (log) await log.destroy();
    console.log(err);
    return [undefined, undefined];
  }
}
const addExpense = async (req, res) => {
  if (!(await checkOwnership(req, req.body.car.id)))
    sendError(res, 401, "Rights", "You don't have permissions to do so!", true);
  const [log, expense] = await createLogAndExpense(req);
  if (!log || !expense) sendError(res, 400, "Error", "EPIC FAIL!", true);
  switch (req.body.type) {
    default:
    case "1":
    case undefined: {
      if (req.body.liters) {
        let refuel;
        try {
          refuel = db.Refuels.create({
            expenseId: expense.id,
            liters: req.body.liters,
          });
          res.sendStatus(200);
        } catch {
          if (refuel) await refuel.destroy();
          if (expense) await expense.destroy();
          if (log) await log.destroy();
          sendError(res, 400, "error", "Adding to DB Error!", true);
        }
      } else {
        sendError(res, 400, "error", "Refuel Server Error!", true);
      }
      break;
    }
    case "2": {
      //One Time
      res.sendStatus(200);
      break;
    }
    case "3": {
      // Reccuring
      let recurring;
      try {
        recurring = db.RecurringExpenses.create({
          expenseId: expense.id,
        });
        res.sendStatus(200);
      } catch {
        if (recurring) await recurring.destroy();
        if (expense) await expense.destroy();
        if (log) await log.destroy();
        sendError(res, 400, "error", "Adding to DB Error!", true);
      }
      break;
    }
    case "4": {
      //With Expiry date
      let expires;
      if (req.body.dateRange)
        try {
          expires = db.ProlongedExpense.create({
            expenseId: expense.id,
            endDate: req.body.dateRange[1],
          });
          res.sendStatus(200);
        } catch {
          if (expires) await expires.destroy();
          if (expense) await expense.destroy();
          if (log) await log.destroy();
          sendError(res, 400, "error", "Adding to DB Error!", true);
        }
      break;
    }
  }
};
exports.addExpense = addExpense;

const listExpensesByUser = async (req, res) => {
  const user = await db.Users.findOne({
    where: { email: req.user.email },
    attributes: [],
    include: {
      model: db.Logs,
      as: "logs",

      include: [
        { model: db.Cars, as: "car" },
        {
          model: db.Expenses,
          as: "expenses",
          attributes: ["price", "date"],
          include: [
            { model: db.ProlongedExpense, as: "prolongedExpenses" },
            { model: db.RecurringExpenses, as: "recurringExpenses" },
            { model: db.Refuels, as: "refuels" },
          ],
        },
      ],
    },
    order: [["logs", "id", "DESC"]],
  });
  res.status(200).json(user);
};
exports.listExpensesByUser = listExpensesByUser;

const latestExpensesByCars = async (req, res) => {
  const user = await getUser(req);
  req.body.carids.forEach((carid) => {
    console.log(carid);
    db.Ownerships.findOne({
      where: { carId: carid, userId: user.id },
    }).then((data) => {
      if (!data) {
        sendError(res, 400, "error", carid, true);
      }
    });
  });
  const monthly = await db.Logs.findAll({
    where: [
      { carId: { [Op.or]: req.body.carids } },
      sequelize.where(sequelize.col("expenses.prolongedExpenses.id"), null),
      sequelize.where(sequelize.col("expenses.recurringExpenses.id"), null),
    ],
    include: [
      {
        model: db.Expenses,
        as: "expenses",
        include: [
          {
            model: db.RecurringExpenses,
            as: "recurringExpenses",
            attributes: [],
          },
          {
            model: db.ProlongedExpense,
            as: "prolongedExpenses",
            attributes: [],
          },
        ],
        where: [
          {
            date: {
              [Op.gte]: new Date(new Date() - 30 * 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
        attributes: [],
      },
    ],
    attributes: [
      "carId",
      [sequelize.fn("sum", sequelize.col("expenses.price")), "monthly"],
    ],
    group: ["carId"],
  });
  const yearly = await db.Logs.findAll({
    where: [
      { carId: { [Op.or]: req.body.carids } },
      sequelize.where(sequelize.col("expenses.prolongedExpenses.id"), null),
      sequelize.where(sequelize.col("expenses.recurringExpenses.id"), null),
    ],
    include: [
      {
        model: db.Expenses,
        as: "expenses",
        include: [
          {
            model: db.RecurringExpenses,
            as: "recurringExpenses",
            attributes: [],
          },
          {
            model: db.ProlongedExpense,
            as: "prolongedExpenses",
            attributes: [],
          },
        ],
        where: [
          {
            date: {
              [Op.gte]: subtractYears(2, new Date()),
            },
          },
        ],
        attributes: [],
      },
    ],
    attributes: [
      "carId",
      [sequelize.fn("sum", sequelize.col("expenses.price")), "yearly"],
    ],
    group: ["carId"],
  });
  const alltime = await db.Logs.findAll({
    where: [
      { carId: { [Op.or]: req.body.carids } },
      sequelize.where(sequelize.col("expenses.prolongedExpenses.id"), null),
      sequelize.where(sequelize.col("expenses.recurringExpenses.id"), null),
    ],
    include: [
      {
        model: db.Expenses,
        as: "expenses",
        include: [
          {
            model: db.RecurringExpenses,
            as: "recurringExpenses",
            attributes: [],
          },
          {
            model: db.ProlongedExpense,
            as: "prolongedExpenses",
            attributes: [],
          },
        ],

        attributes: [],
      },
    ],
    attributes: [
      "carId",
      [sequelize.fn("sum", sequelize.col("expenses.price")), "alltime"],
    ],
    group: ["carId"],
  });
  res.status(200).json({ monthly, yearly, alltime });
};
exports.latestExpensesByCars = latestExpensesByCars;

const expensesAndRefuelsByCar = async (req, res) => {
  const user = await getUser(req);
  db.Ownerships.findOne({
    where: { carId: req.params.id, userId: user.id },
  }).then((data) => {
    if (!data) {
      sendError(res, 400, "error", carid, true);
    }
  });
  const logs = await db.Logs.findAll({
    where: [
      sequelize.where(sequelize.col("expenses.prolongedExpenses.id"), null),
      sequelize.where(sequelize.col("expenses.recurringExpenses.id"), null),
    ],
    include: [
      {
        model: db.Cars,
        as: "car",
        where: { id: req.params.id },
        attributes: [],
      },
      {
        model: db.Expenses,
        as: "expenses",
        attributes: { exclude: ["id", "logId"] },
        include: [
          {
            model: db.RecurringExpenses,
            as: "recurringExpenses",
            attributes: [],
          },
          {
            model: db.ProlongedExpense,
            as: "prolongedExpenses",
            attributes: [],
          },
          {
            model: db.Refuels,
            as: "refuels",
            // attributes: { exclude: ["id", "expenseId"] },
            attributes: ["liters"],
          },
        ],
      },
      { model: db.Users, as: "user", attributes: ["username"] },
    ],
    attributes: ["id", "mileage"],
    order: [["expenses", "date", "DESC"]],
  });
  res.status(200).json(logs);
};
exports.expensesAndRefuelsByCar = expensesAndRefuelsByCar;

const recurringExpensesByCar = async (req, res) => {
  const user = await getUser(req);
  await db.Ownerships.findOne({
    where: { carId: req.params.id, userId: user.id },
  }).then((data) => {
    if (!data) {
      sendError(res, 400, "error", "carid", true);
    }
  });
  const logs = await db.Logs.findAll({
    where: { carId: req.params.id },
    include: [
      {
        model: db.Cars,
        as: "car",
        where: { id: req.params.id },
        attributes: ["id"],
      },
      {
        model: db.Expenses,
        as: "expenses",
        attributes: { exclude: ["id", "logId"] },
        include: [
          {
            model: db.RecurringExpenses,
            as: "recurringExpenses",
            attributes: ["id"],
            right: true,
          },
        ],
      },
      { model: db.Users, as: "user", attributes: ["username"] },
    ],
    attributes: ["id", "mileage"],
    order: [["expenses", "id", "DESC"]],
  });
  res.status(200).json(logs);
};
exports.recurringExpensesByCar = recurringExpensesByCar;

const prolongedExpensesByCar = async (req, res) => {
  const user = await getUser(req);
  db.Ownerships.findOne({
    where: { carId: req.params.id, userId: user.id },
  }).then((data) => {
    if (!data) {
      sendError(res, 400, "error", carid, true);
    }
  });
  const logs = await db.Logs.findAll({
    // where: [
    //   sequelize.where(sequelize.col("expenses.refuels.id"), null),
    //   sequelize.where(sequelize.col("expenses.recurringExpenses.id"), null),
    // ],
    where: { carId: req.params.id },
    include: [
      {
        model: db.Cars,
        as: "car",
        attributes: [],
      },
      {
        model: db.Expenses,
        as: "expenses",
        attributes: { exclude: ["id", "logId"] },
        include: [
          {
            model: db.ProlongedExpense,
            as: "prolongedExpenses",
            attributes: ["endDate"],
            right: true,
            // required: true,
          },
        ],
      },
      { model: db.Users, as: "user", attributes: ["username"] },
    ],
    attributes: ["id", "mileage"],
    order: [["expenses", "id", "DESC"]],
  });
  res.status(200).json(logs);
};
exports.prolongedExpensesByCar = prolongedExpensesByCar;

const deleteLog = async (req, res) => {
  const user = await getUser(req);
  const logs = await db.Logs.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: db.Users,
        as: "user",
        attributes: [],
        include: {
          model: db.Ownerships,
          as: "owns",
          where: { userId: user.id },
          attributes: [],
        },
      },
    ],
  });
  if (logs) {
    try {
      await logs.destroy();
      res.sendStatus(200);
    } catch (err) {
      sendError(res, 400, "error", err);
    }
  } else sendError(res, 400, "Can't find log");
};
exports.deleteLog = deleteLog;

const addExpiry = async (req, res) => {
  const user = await getUser(req);
  const reccuringExpense = await db.RecurringExpenses.findOne({
    include: {
      model: db.Expenses,
      as: "expense",
      include: {
        model: db.Logs,
        as: "log",
        where: { id: req.params.id },
        include: [
          {
            model: db.Users,
            as: "user",
            include: {
              model: db.Ownerships,
              as: "owns",
              attributes: [],
              where: { userId: user.id },
            },
            // attributes: ["id"],
          },
        ],
        // attributes: ["id"],
      },
      right: true,
    },
    // attributes: ["id"],
  });
  try {
    const expires = await db.ProlongedExpense.create({
      expenseId: reccuringExpense.expense.id,
      endDate: req.body.date,
    });
    await reccuringExpense.destroy();
    res.status(200).json(expires);
  } catch (err) {
    res.sendStatus(400);
  }
};

exports.addExpiry = addExpiry;
