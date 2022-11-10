import { showNotification } from "@mantine/notifications";
import router from "next/router";
import { UserInfo } from "./card";

export function getJWTdata(): UserInfo | undefined {
  if (document.cookie) {
    try {
      const cookie: UserInfo = JSON.parse(
        Buffer.from(
          document.cookie.split("=")[1].split(".")[1],
          "base64"
        ).toString()
      );
      return cookie;
    } catch {
      showNotification({
        title: "Cookie Error!",
        message: "Your Cookies are invalid. Logged out",
        color: "red",
      });
      removeJWTdata();
      // return undefined;
    }
  } else return undefined;
}
export function removeJWTdata() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  showNotification({
    title: "Logged Out!",
    message: "You have been logged out",
    color: "blue",
  });
  router.push("/signin");
}
