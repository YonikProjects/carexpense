const sendError = (res, status, code, message, notification) => {
  res
    .status(status)
    .send({
      status: "error",
      code: code,
      message: message,
      notification: notification,
    });
};
module.exports = sendError;
