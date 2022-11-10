import { Button, ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { Sun, MoonStars } from "tabler-icons-react";

export function DarkModeIcon() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });
  const dark = colorScheme === "dark";
  const toggler = () => {
    if (dark) {
      setColorScheme("light");
    } else setColorScheme("dark");
  };
  useEffect(() => {
    // console.log(sessionStorage.getItem("dark"));
    // if (
    //   sessionStorage.getItem("dark") !== "false" &&
    //   sessionStorage.getItem("dark")
    // ) {
    //   toggler();
    // }
  }, []);
  return (
    <Button
      size="sm"
      variant={dark ? "light" : "filled"}
      // color={dark ? "yellow" : "blue"}
      leftIcon={dark ? <Sun size={18} /> : <MoonStars size={18} />}
      onClick={() => toggler()}
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
