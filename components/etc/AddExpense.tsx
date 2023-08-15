import {
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stepper,
  TextInput,
  Text,
} from "@mantine/core";
import { DatePicker, DateRangePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CarLogs } from "./card";

function AddCarButton() {
  const [carInfo, setCarInfo] = useState<CarLogs[]>([]);
  // const d = new Date();
  // let year = d.getFullYear();
  const [active, setActive] = useState(0);
  const [errorFetch, setErrorFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [debounced] = useDebouncedValue(active, 10);
  const [noCars, setNoCars] = useState(false);
  const data = [
    { value: "1", label: "Refuel" },
    { value: "2", label: "One-Time Expense" },
    { value: "3", label: "Recurring Expense" },
    { value: "4", label: "Expense with Expiry Date" },
  ];
  const form = useForm({
    validate: {
      car: (value: CarLogs) => (!value ? "Please choose your car" : null),
      mileage: (value: number) => {
        if (form.values.car)
          if (form.values.car.logs[0] !== undefined)
            if (value > (form.values.car.logs[0].mileage as number) || !value) {
              return null;
            } else return "Mileage can't be smaller than previous one";
          else return null;
      },
      type: (value: string) => (value ? null : null),
    },
  });
  useEffect(() => {
    if (opened) {
      setLoading(true);
      axios
        .get("/api/private/listallcars")
        .then((res) => {
          if (res.data.length === 0) setNoCars(true);
          setCarInfo(res.data as CarLogs[]);
          form.resetDirty();
        })
        .catch(() => {
          setErrorFetch(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [opened]);
  const handleSubmit = (values: {}) => {
    setLoading(true);
    axios
      .post("/api/private/addExpense", values)
      .then(() => {
        showNotification({
          title: "Success!",
          message: "Added successfully!",
        });
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
  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 1 ? current + 1 : current;
    });

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Button onClick={() => setOpened(true)}>New Expense</Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setActive(0);
          form.reset();
        }}
        title="Add new Expense"
        // padding="xl"
        // size="md"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stepper active={active} breakpoint="sm">
            <Stepper.Step label="First step" description="Choose Your Car">
              {!noCars ? (
                <Select
                  searchable
                  required
                  disabled={loading}
                  label={"Pick your car"}
                  placeholder={
                    !loading ? "Choose your car" : "Loading... Please Wait"
                  }
                  data={carInfo.map((car) => {
                    return {
                      value: car,
                      label: `${car.nickname} ${car.manufacturer} ${car.model} ${car.year}`,
                    };
                  })}
                  {...form.getInputProps("car")}
                />
              ) : (
                <Paper withBorder p="sm">
                  No Cars Found, go to
                  <Link href="/garage" color="blue" passHref>
                    <a>
                      <Text color="blue" span>
                        {" "}
                        garage{" "}
                      </Text>
                    </a>
                  </Link>
                  and create a car first.
                </Paper>
              )}
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Expense Type">
              <TextInput
                label="Expense Name"
                placeholder="Name your Expense"
                {...form.getInputProps("name")}
              />
              <Select
                label="Pick your expense type"
                defaultValue="1"
                data={data}
                {...form.getInputProps("type")}
              />

              <NumberInput
                required
                label="Expense Price"
                placeholder="How much did it cost?"
                hideControls
                precision={2}
                step={0.01}
                {...form.getInputProps("price")}
              />
              <>
                {(() => {
                  switch (form.values.type) {
                    case "1":
                    default: {
                      return (
                        <>
                          {form.values.car &&
                          !form.isDirty("date") &&
                          !form.isDirty("dateRange") ? (
                            <NumberInput
                              // min={form.values.car.logs[0]}
                              max={2147483647}
                              // defaultValue={year}
                              placeholder={`Last reported mileage is: ${
                                form.values.car.logs[0]
                                  ? form.values.car.logs[0].mileage
                                  : 0
                              }`}
                              label={`Mileage`}
                              hideControls
                              disabled={
                                form.isDirty("date") ||
                                form.isDirty("dateRange")
                              }
                              {...form.getInputProps("mileage")}
                            />
                          ) : (
                            <></>
                          )}
                          <NumberInput
                            label="Liters Refueled"
                            required
                            placeholder="How much did you refuel?"
                            hideControls
                            precision={2}
                            step={0.01}
                            {...form.getInputProps("liters")}
                          />
                          <DatePicker
                            defaultValue={new Date()}
                            placeholder="Refuel date"
                            label="Refuel date"
                            required
                            {...form.getInputProps("date")}
                          />
                        </>
                      );
                    }
                    case "2":
                      return (
                        <>
                          {form.values.car && (
                            <NumberInput
                              // min={form.values.car.logs[0]}
                              // max={year}
                              // defaultValue={year}
                              placeholder={`Last reported mileage is: ${form.values.car.logs[0].mileage}`}
                              label={`Mileage`}
                              hideControls
                              {...form.getInputProps("mileage")}
                            />
                          )}
                          <DatePicker
                            defaultValue={new Date()}
                            placeholder="Pick date"
                            label="Event date"
                            required
                            {...form.getInputProps("date")}
                          />
                        </>
                      );
                    case "3":
                      return (
                        <DatePicker
                          defaultValue={new Date()}
                          placeholder="Pick date"
                          label="Event date"
                          required
                          {...form.getInputProps("date")}
                        />
                      );
                    case "4":
                      return (
                        <DateRangePicker
                          required
                          label="Pick Range"
                          placeholder="Pick dates range"
                          {...form.getInputProps("dateRange")}
                        />
                      );
                  }
                })()}
              </>
            </Stepper.Step>
          </Stepper>

          <Group position="right" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active !== 1 ? (
              <Button
                loading={loading}
                disabled={errorFetch || noCars}
                onClick={nextStep}
              >
                {!errorFetch ? "Next step" : "Form Error, Please try again"}
              </Button>
            ) : (
              <Button
                loading={loading}
                disabled={debounced !== 1}
                type="submit"
              >
                Submit
              </Button>
            )}
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default AddCarButton;
