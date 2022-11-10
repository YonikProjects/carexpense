const express = require("express");
const path = require("path");
const next = require("next");
const cookieParser = require("cookie-parser");
const sendError = require("./routes/handlers");
const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

function startExpress() {
  const app = express();
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api/", require("./routes/routes"));
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    if (dev) {
      console.log("My app is listening at ", port);
      console.log("dev mode: ", dev);
    }
    require("./dbmodels/checkConnection").checkConnection();
  });
}

app
  .prepare()
  .then(() => {
    startExpress();
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
