import {
  Card,
  Group,
  Text,
  Menu,
  ActionIcon,
  Button,
  Checkbox,
  NumberInput,
  TextInput,
  Modal,
  Paper,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconDots, IconEye, IconPlus, IconTrash } from "@tabler/icons";
import axios from "axios";
import router from "next/router";
import { useEffect, useState } from "react";
import { CarExpenses } from "./card";
import ViewCarExpenses from "./ViewCarExpenses";

export default function CarCard(car: CarExpenses) {
  const format = /[`!@#$%^&*()_+\-=\[\]{};"':\\|,.<>\/?~]/;
  const [opened, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);
  const [alltime, setAllTime] = useState(0);

  useEffect(() => {
    car.monthly.map((value) => {
      if (value.carId === car.id) {
        setMonthly(value.monthly);
      }
    });
    car.yearly.map((value) => {
      if (value.carId === car.id) {
        setYearly(value.yearly);
      }
    });
    car.alltime.map((value) => {
      if (value.carId === car.id) {
        setAllTime(value.alltime);
      }
    });
  });
  const d = new Date();
  let year = d.getFullYear();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      manufacturer: car.manufacturer,
      model: car.model,
      year: car.year,
      nickname: car.nickname,
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
      .put(`/api/private/updateCar/${car.id}`, values)
      .then(() => {
        router.reload();
        showNotification({
          title: "Success!",
          message: "Edit has been successful",
          color: "green",
        });
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
  const form2 = useForm({
    initialValues: {
      email: "",
    },
  });
  const handleSubmit2 = (values: { email: string }) => {
    setLoading(true);
    axios
      .put(`/api/private/addcarowner/${car.id}`, values)
      .then(() => {
        setOpened2(false);
        showNotification({
          title: "Success!",
          message: "Request to accept ownership has been sent",
          color: "green",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Delete a Car",
      closeOnConfirm: false,
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to delete this car?
            {car.users[0].Ownerships.isPrimary
              ? `You're a primary owner, you can delete this car for everyone or just for yourself`
              : "You're not a Primary owner, car is deleted only for you, but you can ask a Primary Owner to invite you again"}
          </Text>
          {car.users[0].Ownerships.isPrimary && (
            <Checkbox
              onChange={(event) =>
                openConfirmModal({
                  title: "Are you 100% sure?",
                  closeOnConfirm: false,

                  centered: true,
                  children: (
                    <Text size="sm">
                      This car will be removed for ANYBODY and there will be no
                      way to recover it!
                    </Text>
                  ),
                  confirmProps: { color: "red" },
                  labels: {
                    confirm: "Delete it permanently",
                    cancel: "No don't delete it",
                  },
                  onCancel: () => console.log(event),
                  onConfirm: () => {
                    setLoading(true);
                    axios
                      .delete(`/api/private/deletecar/${car.id}/true`)
                      .then(() => {
                        router.reload();
                      })
                      .catch(() => setLoading(false));
                  },
                })
              }
              color="red"
              label="Remove it completely!"
            />
          )}
        </>
      ),
      labels: { confirm: "Delete it", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        setLoading(true);
        axios
          .delete(`/api/private/deletecar/${car.id}/false`)
          .then(() => {
            router.reload();
          })
          .catch(() => setLoading(false));
      },
    });

  return (
    <>
      <Card withBorder shadow="xl" radius="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group position="center">
            <Group>
              <Text weight={400}>{car.nickname} </Text>
              <Text weight={400}>{car.manufacturer} </Text>
              <Text weight={400}>{car.model} </Text>
              <Text weight={400}>{car.year} </Text>
            </Group>
          </Group>
        </Card.Section>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Edit This Car"
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
        <Modal
          opened={opened2}
          onClose={() => setOpened2(false)}
          title="Add Secondary Owner"
        >
          <form onSubmit={form2.onSubmit((values) => handleSubmit2(values))}>
            <TextInput
              label="Email"
              placeholder="user@user.com"
              required
              {...form2.getInputProps("email")}
            />
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Modal>
        <Text mt="sm" color="dimmed" size="sm">
          <Text component="span" inherit color="blue">
            Cost for the last 30 days:{" "}
          </Text>
          {monthly}₪
        </Text>
        <Text mt="sm" color="dimmed" size="sm">
          <Text component="span" inherit color="blue">
            Cost for the last Year:{" "}
          </Text>
          {yearly}₪
        </Text>
        <Text mt="sm" color="dimmed" size="sm">
          <Text component="span" inherit color="blue">
            Overall Cost:{" "}
          </Text>
          {alltime}₪
        </Text>

        <Card.Section withBorder inheritPadding py="xs" mt="sm" pb="md">
          <Group position="apart">
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {car.users[0].Ownerships.isPrimary && (
                  <>
                    <Menu.Item
                      onClick={() => setOpened2(true)}
                      icon={<IconPlus size={14} />}
                    >
                      Add Secondary Owner
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => setOpened(true)}
                      icon={<IconEye size={14} />}
                    >
                      Edit this Car
                    </Menu.Item>
                  </>
                )}

                <Menu.Item
                  onClick={openDeleteModal}
                  icon={<IconTrash size={14} />}
                  color="red"
                >
                  Remove this Car
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {car.users[0].Ownerships.isPrimary && (
              <Paper p="5px" withBorder>
                <Text color="green">Primary</Text>
              </Paper>
            )}
            <ViewCarExpenses {...car} />
          </Group>
        </Card.Section>
      </Card>
    </>
  );
}
