const db = require("../dbmodels/db");
const sendError = require("../routes/handlers");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Ownerships } = require("../dbmodels/db");
const bcrypt = require("bcrypt");

async function getUser(req) {
  const user = await db.Users.findOne({
    where: { email: req.user.email },
  });
  return await user;
}
async function resetOwnerships(carId) {
  let own = await db.Ownerships.findAll({ where: { carId: req.params.id } });
  if (own.length === 0) {
    car.destroy();
  } else {
    for (const owner of own) {
      await owner.update({ isAccepted: false });
    }
  }
}
const addNewCar = async (req, res) => {
  user = await getUser(req);
  const car = await db.Cars.create({
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    year: req.body.year,
    nickname: req.body.nickname,
  });
  const ownership = await car.createOwnership({
    userId: user.dataValues.id,
    isPrimary: true,
  });
  console.log(ownership);
  res.status(200).send({ status: "success" });
};
exports.addNewCar = addNewCar;

const listAllCars = async (req, res) => {
  const cars = await db.Cars.findAll({
    include: [
      {
        model: db.Users,
        as: "users",
        where: { email: req.user.email },
        attributes: ["id"],
        through: {
          where: { isAccepted: true },
          attributes: ["id", "isPrimary"],
        },
      },
      // {
      //   model: db.Ownerships,
      //   as: "ownership",
      //   where: { isAccepted: true },
      //   attributes: ["isPrimary"],
      // },
      {
        model: db.Logs,
        as: "logs",
        limit: 1,
        order: [["mileage", "DESC"]],
        attributes: ["mileage"],
      },
    ],
  });
  res.status(200).json(cars);
};
exports.listAllCars = listAllCars;

const deleteCar = async (req, res) => {
  const user = await getUser(req);
  let car = await user.getCars({ where: { id: req.params.id } });
  car = car.pop();
  let ownership = await user.getOwns({ where: { carId: req.params.id } });
  ownership = ownership.pop();

  if (req.params.permanent === "true" && ownership.isPrimary === true) {
    await ownership.destroy();
    await car.destroy();
  } else if (req.params.permanent === "true" && ownership.isPrimary !== true) {
    sendError(res, 401, "Unauthorized", "Unauthorized", false);
  } else {
    await ownership.destroy();
    resetOwnerships(req.params.id);
  }

  res.sendStatus(200);
};
exports.deleteCar = deleteCar;
const updateCar = async (req, res) => {
  const car = await db.Cars.findByPk(req.params.id);
  const user = await getUser(req);
  let ownership = await user.getOwns({ where: { carId: req.params.id } });
  ownership = ownership.pop();
  if (ownership.isPrimary) {
    car.set({
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      nickname: req.body.nickname,
    });
    await car.save();
    res.status(200).send({ status: "success" });
  } else res.sendStatus(400);
};
exports.updateCar = updateCar;

const addOwner = async (req, res) => {
  const user = await getUser(req);
  const user2 = await db.Users.findOne({ where: { email: req.body.email } });
  if (JSON.stringify(await user) === JSON.stringify(await user2)) {
    sendError(res, 400, "email", "You can't put your own email!", true);
  }
  if (user2 === null) {
    sendError(res, 400, "email", "Can't find a user with that email", true);
  }
  console.log(user2.id);
  let ownership = await user.getOwns({ where: { carId: req.params.id } });
  ownership = ownership.pop();
  if (ownership.isPrimary) {
    const [ownership2, created] = await db.Ownerships.findOrCreate({
      where: { userId: user2.id, carId: req.params.id },
      defaults: { carId: req.params.id, isPrimary: false, isAccepted: false },
    });
    console.log(created, ownership2);
    if (!created) {
      sendError(res, 400, "email", "This user has already been added", true);
    } else res.sendStatus(200);
  } else res.sendStatus(401);
};
exports.addOwner = addOwner;

const listAllPendings = async (req, res) => {
  const user = await getUser(req);
  const cars = await db.Cars.findAll({
    include: {
      model: db.Ownerships,
      as: "ownership",
      where: { userId: user.id, isAccepted: false },
      attributes: ["id", "isPrimary"],
    },
  });
  res.status(200).json(cars);
};
exports.listAllPendings = listAllPendings;

const pendingAction = async (req, res) => {
  const user = await getUser(req);
  const ownership = await db.Ownerships.findOne({
    where: { id: req.params.id, userId: user.id },
  });
  const allCarOwnerships = await db.Ownerships.findAll({
    where: { carId: ownership.carId, isPrimary: true },
  });
  if (req.params.answer === "accept") {
    if (allCarOwnerships.length === 0) {
      await ownership.update({ isPrimary: true });
    }
    if (ownership !== null) await ownership.update({ isAccepted: true });
    else sendError(res, 401, "car", "You are not authorized");
  } else ownership.destroy();
  res.sendStatus(200);
};
exports.pendingAction = pendingAction;

const editUser = async (req, res) => {
  console.log(req.body);
  const user = await getUser(req);
  const { count, rows } = await db.Users.findAndCountAll({
    where: { email: req.body.email },
  });
  if (count === 0 || (count === 1 && user.id === rows[0].id)) {
    try {
      await user.update({ username: req.body.username, email: req.body.email });
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: 2630000,
        }
      );
      res
        .status(200)
        .cookie("token", token, { maxAge: 2630000000 })
        .json({ success: true });
    } catch (err) {
      sendError(res, 400, "dbError", err);
    }
  } else {
    sendError(res, 400, "email", "User with that email already exists.", false);
  }
};
exports.editUser = editUser;
const editUserPassword = async (req, res) => {
  const user = await getUser(req);

  bcrypt.compare(
    req.body.oldPassword,
    user.hashedPassword.toString(),
    function (err, result) {
      if (err || !result)
        sendError(res, 400, "oldPassword", "Wrong Old Password!");
      else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
            if (!err) {
              await user.update({ hashedPassword: hash });
              res.sendStatus(200);
            } else console.log(err);
          });
        });
      }
    }
  );
};
exports.editUserPassword = editUserPassword;

const cookieRefresh = async (req, res) => {
  const user = await getUser(req);
  try {
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: 2630000,
      }
    );
    res
      .status(200)
      .cookie("token", token, { maxAge: 2630000000 })
      .json({ "token was set": "yes" });
  } catch (err) {
    sendError(res, 400, "test", "Problem", true);
  }
};
exports.cookieRefresh = cookieRefresh;
