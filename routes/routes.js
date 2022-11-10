const express = require("express");
const router = express.Router();
router.use((req, res, next) => {
  next();
});
try {
  router.use("/public/", require("./publicRoutes"));
  router.use("/private/", require("./privateRoutes"));
} catch (err) {
  console.error(err);
}

module.exports = router;
