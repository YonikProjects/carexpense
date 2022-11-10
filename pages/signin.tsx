import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Container,
  Title,
} from "@mantine/core";
import Link from "next/link";

import axios from "axios";
import { useState } from "react";
import router from "next/router";
import { showNotification } from "@mantine/notifications";

const Signin: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const [errorForm, setErrorForm] = useState(false);
  const handleSubmit = (values: any) => {
    setLoading(true);
    axios
      .post("/api/public/signIn", values)
      .then(() => {
        showNotification({
          title: "Success!",
          message: "Sign in successful!",
          color: "green",
        });
        router.replace("/");
      })
      .catch((error) => {
        if (error.response.data.code === "fail") setErrorForm(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Container
      size={420}
      // my={40}
    >
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Sign In
      </Title>
      <Group position="center" spacing={5}>
        <Text color="dimmed" size="sm" mt={5}>
          Do not have an account yet?
        </Text>
        <Link href="/signup">
          <a>
            <Text color="blue" size="sm" mt={5}>
              Register Now{" "}
            </Text>
          </a>
        </Link>
      </Group>
      <Paper withBorder p={30} mt={30} radius="md">
        {errorForm && (
          <Text align="center" color="red">
            Email or password is incorrect.
          </Text>
        )}

        <form
          autoComplete="on"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <TextInput
            autoComplete="email"
            label="E-mail"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            autoComplete="current-password"
            mt="sm"
            placeholder="Your password"
            label="Password"
            required
            {...form.getInputProps("password")}
          />

          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signin;
