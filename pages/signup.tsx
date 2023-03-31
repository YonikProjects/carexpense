import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Container,
  Title,
  Center,
  Box,
  Collapse,
} from "@mantine/core";
import { Check, X } from "tabler-icons-react";
import axios from "axios";
import { useState } from "react";
function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? <Check size={14} /> : <X size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const Signup: NextPage = () => {
  const [collapse, setCollapse] = useState(false);
  const [collapse2, setCollapse2] = useState(false);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => (value.length! < 3 ? "Username is too short" : null),
      confirmPassword: (value, values) =>
        value !== values.password ? "" : null,
      email: (value) =>
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? "Invalid email"
          : null,
    },
  });

  const handleSubmit = (values: any) => {
    setLoading(true);
    axios
      .post("/api/public/createUser", values)
      .then(() => {
        router.replace({ pathname: "/signin", query: { signup: true } });
      })
      .catch((error) => {
        if (error.response.data.code === "email")
          form.setErrors({ email: "Email already exists" });
        if (error.response.data.errors)
          error.response.data.errors.forEach(
            (err: { param: string; msg: string }) =>
              form.setErrors({ [err.param]: err.msg })
          );
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
        Create an account
      </Title>
      <Group position="center" spacing={5}>
        <Text color="dimmed" size="sm" mt={5}>
          Already have an account?
        </Text>
        <Link href="/signin">
          <a>
            <Text color="blue" size="sm" mt={5}>
              Login
            </Text>
          </a>
        </Link>
      </Group>
      <Paper
        withBorder
        // shadow="md"
        p={30}
        mt={30}
        radius="md"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            autoComplete="off"
            label="Name"
            placeholder="Your Name"
            required
            {...form.getInputProps("username")}
          />
          <TextInput
            label="E-mail"
            autoComplete="email"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            autoComplete="new-password"
            onFocusCapture={() => setCollapse(true)}
            mt="sm"
            placeholder="Your password"
            label="Password"
            required
            {...form.getInputProps("password")}
          />
          <Collapse in={collapse}>
            <PasswordRequirement
              label="Has at least 6 characters"
              meets={form.values.password.length > 5}
            />
          </Collapse>
          <PasswordInput
            autoComplete="off"
            onFocusCapture={() => setCollapse2(true)}
            mt="sm"
            label="Confirm password"
            placeholder="Confirm  password"
            {...form.getInputProps("confirmPassword")}
          />
          <Collapse in={collapse2}>
            <PasswordRequirement
              label="Passwords need to match"
              meets={
                form.values.password === form.values.confirmPassword &&
                form.values.confirmPassword.length > 0
              }
            />
          </Collapse>
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
