import { Button, Center, Modal } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import { Logs } from "./card";

function ConvertExpense(props: { log: Logs; hook: () => void }) {
  const log = props.log;
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    validate: {
      date: (value: Date) => (!value ? "You need to pick a date" : null),
    },
  });
  const handleSubmit = (values: any) => {
    setLoading(true);
    axios
      .post("/api/private/addExpiry/" + log.id, values)
      .then(() => {
        showNotification({
          title: "Success!",
          message: "Added successfully!",
        });
        props.hook();
        setOpened(false);
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
      <Button onClick={() => setOpened(true)}>Add expiry</Button>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title="Add Expiry Date"
        // padding="xl"
        // size={value === null ? undefined : "120vh"}
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <DatePicker
            // defaultValue={new Date()}
            placeholder="Pick date"
            label="Event date"
            minDate={new Date(log.expenses.date)}
            required
            {...form.getInputProps("date")}
          />
          <Center>
            <Button m="10" loading={loading} type="submit">
              Submit
            </Button>
          </Center>
        </form>
      </Modal>
    </>
  );
}

export default ConvertExpense;
