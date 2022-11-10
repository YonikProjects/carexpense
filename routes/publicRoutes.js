const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const publicRepo = require("../repository/publicRepo");
const sendError = require("../routes/handlers");
const express = require("express");
const router = express.Router();

router.post(
  "/createUser",
  body("username").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else publicRepo.createUser(req, res);
  }
);
router.post(
  "/signIn",
  body("email").isEmail(),
  body("password"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, "email", errors, false);
    } else publicRepo.signIn(req, res);
  }
);

// router.delete("/all", (req, res) => {
//   myrepository.deleteAllEntries(res);
// });

// router.delete("/:id", (req, res) => {
//   myrepository.deleteEntry(req.params.id, res);
// });

module.exports = router;
