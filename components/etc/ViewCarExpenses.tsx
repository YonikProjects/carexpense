import {
  Accordion,
  Button,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Table,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CarExpenses, Logs } from "./card";
import ConvertExpense from "./ConvertExpense";

function ViewCarExpenses(car: CarExpenses) {
  const [opened, setOpened] = useState(false);
  const [toggleValue, toggle] = useToggle(["blue", "orange"]);
  const [logs, setLogs] = useState<Logs[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [ths, setThs] = useState(
    <tr>
      <th>Date</th>
      <th>Price</th>
      <th>Mileage</th>
      <th>Liters</th>
      <th>Added By</th>
      <th>Action</th>
    </tr>
  );
  useEffect(() => {
    if (opened && value) {
      console.log(car);
      setLoading(true);
      switch (value) {
        case "onetimeRefuels": {
          axios
            .get("/api/private/expensesAndRefuelsByCar/" + car.id)
            .then((res) => {
              setThs(
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Mileage</th>
                  <th>Liters</th>
                  <th>Added By</th>
                  <th>Action</th>
                </tr>
              );
              setLogs(res.data as Logs[]);
            })
            .catch(() => {})
            .finally(() => {
              setLoading(false);
            });
          break;
        }
        case "recurring": {
          axios
            .get("/api/private/recurringExpensesByCar/" + car.id)
            .then((res) => {
              console.log(res.data);
              setThs(
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Added By</th>
                  <th>Action</th>
                  <th>Expiry</th>
                </tr>
              );
              setLogs(res.data as Logs[]);
            })
            .catch(() => {})
            .finally(() => {
              setLoading(false);
            });
          break;
        }
        case "prolonged": {
          axios
            .get("/api/private/prolongedExpensesByCar/" + car.id)
            .then((res) => {
              setThs(
                <tr>
                  <th>Date</th>
                  <th>End Date</th>
                  <th>Price</th>
                  <th>Added By</th>
                  <th>Action</th>
                </tr>
              );
              setLogs(res.data as Logs[]);
            })
            .catch(() => {})
            .finally(() => {
              setLoading(false);
            });
          break;
        }
      }
    }
  }, [opened, value, toggleValue]);
  return (
    <>
      <Button onClick={() => setOpened(true)}>View</Button>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title={[
          car.nickname,
          " ",
          car.manufacturer,
          " ",
          car.model,
          " ",
          car.year,
        ]}
        // padding="xl"
        size={value === null ? undefined : "120vh"}
      >
        <Accordion
          variant="separated"
          value={value}
          onChange={setValue}
          sx={
            {
              // position: "relative",
            }
          }
        >
          <LoadingOverlay visible={loading} />
          <Accordion.Item value="onetimeRefuels">
            <Accordion.Control>One Time Expenses and Refuels</Accordion.Control>
            {!loading && (
              <Accordion.Panel>
                <ScrollArea sx={{ width: "100%" }}>
                  <Table sx={{ minWidth: "100vh", minHeight: "100%" }}>
                    {/* <caption>Some latest logs made by you</caption> */}
                    <thead>{ths}</thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.expenses.date}</td>
                          <td>{log.expenses.price}</td>
                          <td>{log.mileage}</td>
                          <td>
                            {log.expenses.refuels
                              ? log.expenses.refuels.liters
                              : ""}
                          </td>
                          <td>{[log.user.username]}</td>
                          <td>
                            <Button
                              onClick={() => {
                                axios
                                  .delete("/api/private/deleteLog/" + log.id)
                                  .then(() => {
                                    toggle();
                                  })
                                  .catch(() => {})
                                  .finally(() => {});
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Accordion.Panel>
            )}
          </Accordion.Item>

          <Accordion.Item value="recurring">
            <Accordion.Control>Recurring Expenses</Accordion.Control>
            {!loading && (
              <Accordion.Panel>
                <ScrollArea sx={{ width: "100%" }}>
                  <Table sx={{ minWidth: "100vh", minHeight: "100%" }}>
                    {/* <caption>Some latest logs made by you</caption> */}
                    <thead>{ths}</thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.expenses.date}</td>
                          <td>{log.expenses.price}</td>
                          <td>{[log.user.username]}</td>
                          <td>
                            <Button
                              onClick={() => {
                                axios
                                  .delete("/api/private/deleteLog/" + log.id)
                                  .then(() => {
                                    toggle();
                                  })
                                  .catch(() => {})
                                  .finally(() => {});
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                          <td>
                            <ConvertExpense log={log} hook={() => toggle()} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Accordion.Panel>
            )}
          </Accordion.Item>

          <Accordion.Item value="prolonged">
            <Accordion.Control>Expireable Expenses</Accordion.Control>
            {!loading && (
              <Accordion.Panel>
                <ScrollArea sx={{ width: "100%" }}>
                  <Table sx={{ minWidth: "100vh", minHeight: "100%" }}>
                    {/* <caption>Some latest logs made by you</caption> */}
                    <thead>{ths}</thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.expenses.date}</td>
                          <td>{log.expenses.prolongedExpenses?.endDate}</td>
                          <td>{log.expenses.price}</td>
                          <td>{[log.user.username]}</td>
                          <td>
                            <Button
                              onClick={() => {
                                axios
                                  .delete("/api/private/deleteLog/" + log.id)
                                  .then(() => {
                                    toggle();
                                  })
                                  .catch(() => {})
                                  .finally(() => {});
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Accordion.Panel>
            )}
          </Accordion.Item>

          {/* {car.users[0].Ownerships.isPrimary && (
            <Accordion.Item value="primary">
              <Accordion.Control>User Management</Accordion.Control>
              {!loading && <Accordion.Panel>Placeholder</Accordion.Panel>}
            </Accordion.Item>
          )} */}
        </Accordion>
      </Modal>
    </>
  );
}

export default ViewCarExpenses;
