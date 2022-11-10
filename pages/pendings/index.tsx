import type { NextPage } from "next";
import { Center, Container, Grid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import PendingCar from "../../components/etc/PendingCar";
import { CarPending } from "../../components/etc/card";
const Garage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [carPending, setCarPending] = useState<CarPending[]>([]);
  useEffect(() => {
    axios
      .get("/api/private/listallPendings")
      .then((res) => {
        setCarPending(res.data as CarPending[]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100%" }}>
      {loading && (
        <Center style={{ height: 200 }}>
          <Text size="xl">Fetching Cars... Just a sec</Text>
        </Center>
      )}
      <Container>
        <Grid justify="center">
          {carPending.map((carPending, key) => {
            return (
              <Grid.Col key={key} span={12} xs={6} sm={8} md={5} lg={4}>
                <PendingCar {...carPending}></PendingCar>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
      {carPending.length === 0 && !loading && (
        <Center style={{ height: 200 }}>
          <Text size="xl">No Pending cars</Text>
        </Center>
      )}
    </div>
  );
};

export default Garage;
