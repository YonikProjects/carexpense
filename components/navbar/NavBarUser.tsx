import React, { useEffect, useState } from "react";
import { UserInfo } from "../etc/card";
import { Group, Text, Box, useMantineTheme, NavLink } from "@mantine/core";
import { getJWTdata } from "../etc/cookies";
import { useRouter } from "next/router";

export const User = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();

  const theme = useMantineTheme();
  const [user, setUser] = useState<UserInfo>({
    username: "",
    email: "",
  });
  useEffect(() => {
    setUser(getJWTdata() as UserInfo);
  }, [router.asPath]);
  return (
    <Box
    // sx={{
    //   paddingTop: theme.spacing.sm,
    //   borderBottom: `1px solid ${
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[4]
    //       : theme.colors.gray[2]
    //   }`,
    // }}
    >
      <NavLink
        label={
          <Group>
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {user.username}
              </Text>
              <Text color="dimmed" size="xs">
                {user.email}
              </Text>
            </Box>

            {/* {theme.dir === "ltr" ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )} */}
          </Group>
        }
        sx={{
          // display: "block",
          width: "100%",
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        {children}
      </NavLink>
    </Box>
  );
};
