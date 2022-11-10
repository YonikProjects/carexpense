const sendError = require("../routes/handlers");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const db = require("../dbmodels/db");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, async function (err, hash) {
      if (!err) {
        const [user, created] = await db.Users.findOrCreate({
          where: { email: req.body.email },
          defaults: {
            username: req.body.username,
            hashedPassword: hash,
          },
        });
        if (!created) {
          sendError(
            res,
            400,
            "email",
            "User with that email already exists",
            false
          );
        } else res.status(200).send({ status: "success" });
      } else console.log(err);
    });
  });
};
exports.createUser = createUser;

const signIn = async (req, res) => {
  const email = await db.Users.findOne({ where: { email: req.body.email } });
  // console.log(email.dataValues.hashedPassword.toString());
  if (email === null) return sendError(res, 400, "fail", "", false);
  else {
    bcrypt.compare(
      req.body.password,
      email.hashedPassword.toString(),
      function (err, result) {
        if (err || !result) {
          sendError(res, 400, "fail", "", false);
        } else {
          const token = jwt.sign(
            {
              username: email.username,
              email: email.email,
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
        }
      }
    );
  }
};
exports.signIn = signIn;
