import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import {
  Text,
  Paper,
  Button,
  Container,
  Title,
  Collapse,
  PasswordInput,
  Box,
  Center,
} from "@mantine/core";

import { useState } from "react";

import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

import router from "next/router";

const PasswordInfo: NextPage = () => {
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
  const [collapse, setCollapse] = useState(false);
  const [collapse2, setCollapse2] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      repeatedNewPassword: "",
    },
  });

  const handleSubmit = (values: Object) => {
    setLoading(true);
    axios
      .put("/api/private/editUserPassword", values)
      .then(() => {
        showNotification({
          title: "Success!",
          message:
            "Your Password has been successfully changed and you have been logged out",
          color: "Green",
        });
        router.push("/signout");
      })
      .catch((error) => {
        if (error.response.data.code === "oldPassword") {
          form.setErrors({
            [error.response.data.code]: error.response.data.message,
          });
        }
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
        Change Your Password
      </Title>

      <Paper withBorder p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Paper withBorder p={15} mt={15} radius="md">
            <Text size="sm" style={{ textAlign: "center" }}>
              Important! If you change your password, you will be immediately
              logged out
            </Text>
          </Paper>
          <PasswordInput
            mt="sm"
            placeholder="Your current password"
            label="Old Password"
            required
            {...form.getInputProps("oldPassword")}
          />
          <PasswordInput
            onFocusCapture={() => setCollapse(true)}
            mt="sm"
            placeholder="New Password"
            label="New Password"
            required
            {...form.getInputProps("newPassword")}
          />
          <Collapse in={collapse}>
            <PasswordRequirement
              label="Has at least 6 characters"
              meets={form.values.newPassword.length > 5}
            />
          </Collapse>
          <PasswordInput
            onFocusCapture={() => setCollapse2(true)}
            mt="sm"
            label="Confirm new password"
            placeholder="Type your new password again"
            {...form.getInputProps("repeatedNewPassword")}
          />
          <Collapse in={collapse2}>
            <PasswordRequirement
              label="Passwords need to match"
              meets={
                form.values.newPassword === form.values.repeatedNewPassword &&
                form.values.repeatedNewPassword.length > 0
              }
            />
          </Collapse>
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Submit Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default PasswordInfo;
