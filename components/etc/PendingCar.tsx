import { Card, Group, Text, Button, LoadingOverlay } from "@mantine/core";
import axios from "axios";

import { useState } from "react";
import { CarPending } from "./card";

export default function CarCard(car: CarPending) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const handleAccept = (action: string) => {
    setLoading(true);
    axios
      .get(`/api/private/pendingAction/${car.ownership[0].id}/${action}`)
      .then(() => {
        setHidden(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {!hidden && (
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <Card withBorder shadow="sm" radius="md">
            {/* <Card.Section withBorder inheritPadding py="xs"> */}
            <Group position="center">
              <Group>
                <Text weight={400}>{car.nickname}</Text>
                <Text weight={400}>{car.manufacturer}</Text>
                <Text weight={400}>{car.model} </Text>
                <Text weight={400}>{car.year} </Text>
              </Group>
            </Group>
            {/* </Card.Section> */}

            {/* <Text mt="sm" color="dimmed" size="sm">
              <Text component="span" inherit color="blue">
                Cost for the last 30 days:{" "}
              </Text>
              {car.montlyExpense}₪
            </Text>
            <Text mt="sm" color="dimmed" size="sm">
              <Text component="span" inherit color="blue">
                Cost for the last Year:{" "}
              </Text>
              {car.montlyExpense}₪
            </Text>
            <Text mt="sm" color="dimmed" size="sm">
              <Text component="span" inherit color="blue">
                Overall Cost:{" "}
              </Text>
              {car.montlyExpense}₪
            </Text> */}

            <Card.Section withBorder inheritPadding py="xs" mt="sm" pb="md">
              <Group position="apart">
                <Button onClick={() => handleAccept("deny")} color="red">
                  Deny
                </Button>

                <Button onClick={() => handleAccept("accept")} color="green">
                  Accept
                </Button>
              </Group>
            </Card.Section>
          </Card>
        </div>
      )}
    </>
  );
}
