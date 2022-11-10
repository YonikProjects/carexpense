const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const sendError = require("../routes/handlers");
const express = require("express");
const { default: next } = require("next");
const privateRepo = require("../repository/privateRepo");
const expenseRepo = require("../repository/expenseRepo");

const { body, validationResult } = require("express-validator");
const router = express.Router();
dotenv.config();
router.use((req, res, next) => {
  jwt.verify(
    req.cookies.token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      if (err) {
        res.sendStatus(401);
      } else {
        req.user = decoded;
        next();
      }
    }
  );
});

router.get("/cookieRefresh", (req, res) => {
  privateRepo.cookieRefresh(req, res);
});
router.post(
  "/addnewcar",
  body("manufacturer").trim().escape().isLength({ max: 50 }),
  body("model").trim().escape().isLength({ max: 50 }),
  body("nickname").trim().unescape().isLength({ max: 50 }),
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      privateRepo.addNewCar(req, res);
    } else res.status(400).json({ errors: errors.array() });
  }
);
router.get("/listallcars", (req, res) => {
  privateRepo.listAllCars(req, res);
});
router.delete("/deletecar/:id/:permanent", (req, res) => {
  privateRepo.deleteCar(req, res);
});
router.put(
  "/updatecar/:id/",
  body("manufacturer").trim().escape().isLength({ max: 50 }),
  body("model").trim().escape().isLength({ max: 50 }),
  body("nickname").trim().escape().isLength({ max: 50 }),
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      privateRepo.updateCar(req, res);
    } else res.status(400).json({ errors: errors.array() });
  }
);
router.put("/addcarowner/:id", (req, res) => {
  privateRepo.addOwner(req, res);
});
router.get("/listallpendings", (req, res) => {
  privateRepo.listAllPendings(req, res);
});
router.get("/pendingAction/:id/:answer", (req, res) => {
  privateRepo.pendingAction(req, res);
});
router.put("/editUser/", (req, res) => {
  privateRepo.editUser(req, res);
});
router.put(
  "/editUserPassword/",
  body("newPassword").isLength({ min: 6 }),
  body("repeatedNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else privateRepo.editUserPassword(req, res);
  }
);
router.post(
  "/addExpense/",
  // body("manufacturer").trim().escape().isLength({ max: 50 }),
  // body("model").trim().escape().isLength({ max: 50 }),
  // body("nickname").trim().escape().isLength({ max: 50 }),
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      expenseRepo.addExpense(req, res);
    } else res.status(400).json({ errors: errors.array() });
  }
);
router.get("/listExpensesByUser", (req, res) => {
  expenseRepo.listExpensesByUser(req, res);
});
router.post("/latestExpensesByCars/", (req, res) => {
  expenseRepo.latestExpensesByCars(req, res);
});
router.get("/expensesAndRefuelsByCar/:id", (req, res) => {
  expenseRepo.expensesAndRefuelsByCar(req, res);
});
router.get("/recurringExpensesByCar/:id", (req, res) => {
  expenseRepo.recurringExpensesByCar(req, res);
});
router.get("/prolongedExpensesByCar/:id", (req, res) => {
  expenseRepo.prolongedExpensesByCar(req, res);
});
router.delete("/deleteLog/:id", (req, res) => {
  expenseRepo.deleteLog(req, res);
});
router.post("/addExpiry/:id", (req, res) => {
  expenseRepo.addExpiry(req, res);
});
// router.delete("/all", (req, res) => {
//   myrepository.deleteAllEntries(res);
// });

// router.delete("/:id", (req, res) => {
//   myrepository.deleteEntry(req.params.id, res);
// });

module.exports = router;
