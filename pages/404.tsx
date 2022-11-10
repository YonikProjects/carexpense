import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";
import Link from "next/link";
import axios from "axios";

const useStyles = createStyles((theme) => ({
  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

const Not_Found: NextPage = () => {
  const { classes } = useStyles();
  useEffect(() => {
    axios.get("/api/private/status");
  }, []);

  return (
    <Container>
      <Head>
        <title>404 Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group position="center">
        <Link href="/">
          <a>
            <Button variant="subtle" size="md">
              Take me back to home page
            </Button>
          </a>
        </Link>
      </Group>
    </Container>
  );
};

export default Not_Found;
