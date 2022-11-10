import axios from "axios";
import { showNotification } from "@mantine/notifications";
import router from "next/router";
export const intercept = axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error.response.status) {
      case 401: {
        router.push("/signout");
        showNotification({
          title: "Unathorized!",
          message:
            "You have attempted to do something you don't have permission to. Logged out",
          color: "red",
        });
        break;
      }

      case 413: {
        showNotification({
          title: "Error!",
          message: "Request is too large!",
          color: "red",
        });
        break;
      }
      case 404: {
        showNotification({
          title: "Error!",
          message: "Requested resource not found",
          color: "red",
        });
        break;
      }
      case 500: {
        showNotification({
          title: "Error!",
          message: "Critical server error",
          color: "red",
        });
        break;
      }
    }
    if (error.response.data.notification) {
      showNotification({
        title: "An error has occurred!",
        message: error.response.data.message,
        color: "red",
      });
    }
    return Promise.reject(error);
  }
);
