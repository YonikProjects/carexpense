import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Text,
  Paper,
  Button,
  Container,
  Title,
  Collapse,
} from "@mantine/core";

import { useEffect, useState } from "react";
import { getJWTdata, removeJWTdata } from "../../components/etc/cookies";
import { UserInfo } from "../../components/etc/card";
import axios from "axios";
import router from "next/router";
import { showNotification } from "@mantine/notifications";

const UserInfo: NextPage = () => {
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
    },
  });
  // const [errorForm, setErrorForm] = useState(false);
  const handleSubmit = (values: Object) => {
    setLoading(true);
    axios
      .put("/api/private/editUser", values)
      .then(() => {
        if (!form.isDirty("email")) {
          showNotification({
            title: "Success!",
            message: "Your username has been successfully changed",
            color: "Green",
          });
          router.replace("/");
        } else {
          showNotification({
            title: "Success!",
            message: "Your email has been successfully changed, Logged out.",
            color: "Green",
          });
          removeJWTdata();
        }
      })
      .catch((error) => {
        if (error.response.data.code === "email")
          form.setErrors({ email: error.response.data.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (getJWTdata() !== undefined) form.setValues(getJWTdata() as UserInfo);
    form.resetDirty();
  }, []);

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
        Change Your Account Information{" "}
      </Title>

      <Paper withBorder p={30} mt={30} radius="md">
        {/* {errorForm && (
          <Text align="center" color="red">
            Email or password is incorrect.
          </Text>
        )} */}

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="User Name"
            placeholder="Your Name"
            required
            {...form.getInputProps("username")}
          />

          <TextInput
            onFocusCapture={() => setCollapse(true)}
            onBlurCapture={() => {
              if (!form.isDirty("email")) {
                setCollapse(false);
              }
            }}
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <Collapse in={collapse}>
            <Paper withBorder p={15} mt={15} radius="md">
              <Text size="sm" style={{ textAlign: "center" }}>
                If you change your email, you will be immediately logged out
              </Text>
            </Paper>
          </Collapse>
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Submit Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default UserInfo;
