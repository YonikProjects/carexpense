import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";

import { IconCheck } from "@tabler/icons";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getJWTdata } from "../components/etc/cookies";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 2,
    // paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

const Home: NextPage = () => {
  const [isLogged, setLogged] = useState(false);
  useEffect(() => {
    if (getJWTdata()) {
      setLogged(true);
      axios.get("/api/private/cookieRefresh");
    } else setLogged(false);
  }, []);
  const { classes } = useStyles();

  return (
    <Container>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Not just another car expenses calculator.
          </Title>
          <Text color="dimmed" mt="md">
            Utilizing latest and greatest modern web technologies avaiable
            today!
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={25} radius="xl">
                <IconCheck size={20} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Easy expense types</b> – and at the same time very flexible!
            </List.Item>
            <List.Item>
              <b>Multiple car ownership</b> – got more than one person driving a
              car? You can share your car expenses with others.
            </List.Item>
            <List.Item>
              <b>Versatile</b> – app is retaining 100% functionality whenever
              youre on mobile or on desktop.
            </List.Item>
          </List>

          <Group mt={30}>
            <Link href={!isLogged ? "/signup" : "/expenses"}>
              <Button radius="xl" size="md" className={classes.control}>
                {!isLogged ? "Get Started" : "Go to Expenses"}
              </Button>
            </Link>
            {/* <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button> */}
          </Group>
        </div>
        <Image
          alt=""
          src="android-chrome-512x512.png"
          className={classes.image}
        />
      </div>
    </Container>
  );
};
export default Home;
