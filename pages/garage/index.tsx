import type { NextPage } from "next";
import {
  Center,
  Container,
  Grid,
  Skeleton,
  Space,
  Text,
  Transition,
} from "@mantine/core";
// import CarCard from "../../components/modules/CarCard";
import { lazy, useEffect, useState } from "react";
import AddCarButton from "../../components/etc/AddCarButton";
import axios from "axios";
import { CarExpenses, CarOwnership } from "../../components/etc/card";
const CarCard = lazy(() => import("../../components/etc/CarCard"));
const Garage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [carInfo, setCarInfo] = useState<CarOwnership[]>([]);
  const [carExpenses, setCarExpenses] = useState<CarExpenses>({
    monthly: [],
    yearly: [],
    alltime: [],
  } as CarExpenses);

  useEffect(() => {
    axios
      .get("/api/private/listallcars")
      .then((res) => {
        setLoading(false);
        setCarInfo(res.data as CarOwnership[]);
        axios
          .post("/api/private/latestExpensesByCars", {
            carids: carInfo.map((car) => {
              return car.id;
            }),
          })
          .then((res) => setCarExpenses(res.data as CarExpenses))
          .finally(() => {
            setLoading2(false);
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      {loading && (
        <Center style={{ height: 200 }}>
          <Text size="xl">Fetching Cars... Just a sec</Text>
        </Center>
      )}
      {!loading && (
        <Center>
          <AddCarButton />
        </Center>
      )}

      <Space h="md" />
      <Transition
        mounted={!loading}
        transition="slide-up"
        duration={200}
        // timingFunction="ease"
      >
        {(styles) => (
          <Container style={styles}>
            <Grid justify="center">
              {carInfo.map((carInfo, key) => {
                return (
                  <Grid.Col key={key} span={12} xs={6} sm={8} md={5} lg={4}>
                    <Skeleton visible={loading2}>
                      <CarCard {...{ ...carInfo, ...carExpenses }}></CarCard>
                    </Skeleton>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Container>
        )}
      </Transition>
      {carInfo.length === 0 && !loading && (
        <Center style={{ height: 200 }}>
          <Text size="xl">No cars found</Text>
        </Center>
      )}
    </div>
  );
};

export default Garage;
