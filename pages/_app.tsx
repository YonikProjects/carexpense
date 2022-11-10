import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import Transition from "../components/etc/Transition";
import MainShell from "../components/etc/MainShell";

import { LazyMotion, domAnimation } from "framer-motion";

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    // console.log(theme.colors.dark[]);
  };
  const matches = useMediaQuery("(min-width: 768px)");

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          primaryColor: colorScheme === "dark" ? "yellow" : "green",
          components: {
            Paper: {
              defaultProps: {
                withBorder: "true",
                shadow: "md",
                // onLabel: 'ON',
                // offLabel: 'OFF',
              },
            },
            Modal: { defaultProps: { fullScreen: matches ? false : true } },
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider position="top-center">
            <Head>
              <title>Car Expenses Calculator</title>
              <link rel="icon" type="image/x-icon" href="/favicon.ico" />

              <meta
                name="theme-color"
                content={colorScheme === "dark" ? "#1A1B1E" : "#FFFFFF"}
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              />
              <meta name="HandheldFriendly" content="true" />
            </Head>

            <MainShell>
              <LazyMotion features={domAnimation}>
                <Transition>
                  <Component
                    // fluid
                    {...pageProps}
                  />
                </Transition>
              </LazyMotion>
            </MainShell>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
