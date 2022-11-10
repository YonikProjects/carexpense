import {
  AppShell,
  Footer,
  Header,
  MediaQuery,
  Burger,
  Text,
  useMantineTheme,
  Box,
  Container,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AppHeader } from "../header/AppHeader";
import { DarkModeIcon } from "../header/DarkModeIcon";
import AppNavBar from "../navbar/AppNavBar";
import { intercept } from "./axiosmiddleware";
import { getJWTdata } from "./cookies";

function MainShell({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 768px)");
  const [opened, setOpened] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const theme = useMantineTheme();
  // const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  useEffect(() => {
    if (getJWTdata() === undefined)
      ["/garage", "/user", "/pendings"].forEach((value) => {
        if (router.route.match(value)) {
          router.replace("/");
        }
      });

    setOpened(false);
    if (getJWTdata()) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
    intercept;
    // const handleRouteChange = () => {};
    // router.events.on("routeChangeStart", handleRouteChange);
    // return () => {
    //   router.events.off("routeChangeStart", handleRouteChange);
    // };
  }, [router.asPath, matches]);

  return (
    <AppShell
      // fixed
      navbar={<>{opened || matches ? <AppNavBar /> : <></>}</>}
      footer={
        isSidebarOpen && matches ? (
          <Footer
            // fixed={false}
            height={60}
            p="md"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Car Expenses Calculator</Text>
            <Text>Dima 2022</Text>

            <DarkModeIcon />
          </Footer>
        ) : (
          <></>
        )
      }
      header={
        <Header
          height={56}
          p="md"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isSidebarOpen && (
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => {
                  setOpened((o) => !o);
                }}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
          )}

          <AppHeader />
        </Header>
      }
    >
      {" "}
      <Container
        style={{
          position: "relative",
          minHeight: isSidebarOpen ? "100%" : "90%",
          // maxHeight: "100vh",
          // paddingBottom: "60px",
        }}
      >
        {children}
      </Container>
      {!isSidebarOpen && (
        <Box
          p="md"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // borderTop: " 1px solid dark",
            // height: "60px",
            // marginTop: "-10px",
          }}
        >
          <Text>Car Expenses Calculator</Text>
          <Text>Dima 2022</Text>

          <DarkModeIcon />
        </Box>
      )}
    </AppShell>
  );
}

export default MainShell;
