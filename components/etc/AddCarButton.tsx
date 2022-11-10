import { Button, Group, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import router from "next/router";
import React, { useState } from "react";

function AddCarButton() {
  const format = /[`!@#$%^&*()_+\-=\[\]{};"':\\|,.<>\/?~]/;

  const d = new Date();
  let year = d.getFullYear();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      manufacturer: "",
      model: "",
      year: year,
      nickname: "",
    },
    validate: {
      manufacturer: (value) =>
        value.length > 50
          ? "Manufacturer name is too long"
          : format.test(value)
          ? "Forbidden characters"
          : null,
      model: (value) =>
        value.length > 50
          ? "Model name is too long"
          : format.test(value)
          ? "Forbidden characters"
          : null,
      nickname: (value) =>
        value.length > 50
          ? "Nickname is too long"
          : format.test(value)
          ? "Forbidden characters"
          : null,
    },
  });
  const handleSubmit = (values: {
    manufacturer: string;
    model: string;
    year: number;
    nickname: string;
  }) => {
    setLoading(true);
    axios
      .post("/api/private/addnewcar", values)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
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
    <>
      <Button onClick={() => setOpened(true)}>Add new car</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add new car"
        padding="xl"
        // size="xl"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            required
            label="Manufacturer"
            placeholder="Manufacturer"
            {...form.getInputProps("manufacturer")}
          />
          <TextInput
            required
            label="Model"
            placeholder="Model"
            {...form.getInputProps("model")}
          />
          <NumberInput
            required
            min={1900}
            max={year}
            // defaultValue={year}
            placeholder="Manufacture Year"
            label="Manufacture Year"
            hideControls
            {...form.getInputProps("year")}
          />

          <TextInput
            label="Nickname"
            placeholder="My Favorite car"
            {...form.getInputProps("nickname")}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default AddCarButton;
