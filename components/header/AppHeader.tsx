import React, { useEffect, useState } from "react";
import { Group, Avatar, Button } from "@mantine/core";

import { CheckupList, Login, Logout } from "tabler-icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getJWTdata } from "../etc/cookies";

export function AppHeader() {
  const router = useRouter();
  const [isLogged, setLogged] = useState(false);
  useEffect(() => {
    if (getJWTdata()) {
      setLogged(true);
    } else setLogged(false);
  }, [router.asPath]);
  // const { classes, cx } = useStyles();

  return (
    <>
      <Link href="/">
        <a>
          <Group>
            <Avatar src="/car-operating-costs2.png"></Avatar>
          </Group>
        </a>
      </Link>
      <Group
        spacing={5}
        // className={classes.social}
        position="right"
        noWrap
      >
        {isLogged ? (
          <Link href="/signout">
            <Button
              // size="xs"
              variant="outline"
              leftIcon={<Logout />}
            >
              {/* <a></a> */}
              Logout
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/signup">
              <Button
                // size="xs"
                variant="outline"
                leftIcon={<CheckupList />}
              >
                {/* <a></a> */}
                Register
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                // size="xs"
                variant="outline"
                leftIcon={<Login />}
              >
                {/* <a></a> */}
                Login
              </Button>
            </Link>
          </>
        )}

        {/* <ActionIcon size="lg">
          <BrandTwitter size={18} />
        </ActionIcon>
        <ActionIcon size="lg">
          <BrandYoutube size={18} />
        </ActionIcon>
        <ActionIcon size="lg">
          <BrandInstagram size={18} />
        </ActionIcon> */}
      </Group>
    </>
  );
}
