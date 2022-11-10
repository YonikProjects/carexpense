import { Center, Navbar, NavLink } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSettings, IconUser } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DarkModeIcon } from "../header/DarkModeIcon";
import { getJWTdata } from "../etc/cookies";
import { MainLinks } from "./NavBarLinks";
import { User } from "./NavBarUser";

function AppNavBar() {
  const matches = useMediaQuery("(min-width: 768px)");

  const router = useRouter();
  const [isLogged, setLogged] = useState(false);
  useEffect(() => {
    if (getJWTdata()) {
      setLogged(true);
    } else setLogged(false);
  }, [router.asPath]);
  return (
    <>
      {isLogged && (
        <>
          <Navbar
            fixed
            //   hidden={!opened}
            // position={{ bottom: 60 }}
            p="lg"
            hiddenBreakpoint="sm"
            // height="100%"
            width={{ sm: 250 }}
          >
            <Navbar.Section>
              <User>
                <NavLink label="Personal Settings" disabled />
                <Link href="/user/info" passHref>
                  <NavLink
                    component="a"
                    label="View/Edit your Info"
                    active={router.pathname === "/user/info"}
                    icon={<IconUser size={14} />}
                  />
                </Link>
                <Link href="/user/password" passHref>
                  <NavLink
                    component="a"
                    label="Change Password"
                    icon={<IconSettings size={14} />}
                    active={router.pathname === "/user/password"}
                  />
                </Link>
                {/* <Divider />
                <NavLink label="Danger Zone" disabled />
                <Link href="/user/delete" passHref>
                  <NavLink
                    color="red"
                    variant="subtle"
                    component="a"
                    label="Delete Account"
                    icon={<IconTrash size={14} />}
                    active={router.pathname === "/user/delete"}
                  />
                </Link> */}
              </User>
            </Navbar.Section>
            <Navbar.Section

            // mt="md"
            >
              <MainLinks />
            </Navbar.Section>
            <Navbar.Section>
              {!matches && (
                <>
                  <NavLink label={<DarkModeIcon />}></NavLink>

                  <NavLink
                    label={
                      <Center>Car Expenses Calculator @ By Dima 2022</Center>
                    }
                    disabled
                  />
                </>
              )}
            </Navbar.Section>
          </Navbar>
        </>
      )}
    </>
  );
}

export default AppNavBar;
