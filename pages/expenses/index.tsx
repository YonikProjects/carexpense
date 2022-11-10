import {
  Accordion,
  Center,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Table,
} from "@mantine/core";
import axios from "axios";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import AddExpense from "../../components/etc/AddExpense";
import { Logs } from "../../components/etc/card";

const ExpenseIndex: NextPage = () => {
  const [logs, setLogs] = useState<Logs[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setLoading(true);
      axios
        .get("/api/private/listExpensesByUser")
        .then((res) => {
          setLogs(res.data.logs as Logs[]);
          console.log(res.data.logs);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [value]);
  const ths = (
    <tr>
      <th>Car</th>
      <th>Price</th>
      <th>Mileage</th>
      <th>Liters</th>
      <th>Date</th>
      <th>End date</th>
      <th>Is Recurring?</th>
    </tr>
  );
  return (
    <>
      <Center>
        <AddExpense />
      </Center>
      <Accordion
        variant="contained"
        radius="sm"
        sx={{ marginTop: "10px", position: "relative" }}
        value={value}
        onChange={setValue}
      >
        <LoadingOverlay visible={loading} />
        <Accordion.Item value="customization">
          <Accordion.Control>
            <Center>Latest Logs</Center>
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea sx={{ width: "100%" }}>
              <Paper sx={{ minWidth: "100vh", minHeight: "100%" }}>
                {!loading && (
                  <Table>
                    <caption>Some latest logs made by you</caption>
                    <thead>{ths}</thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            {[
                              log.car.nickname,
                              " ",
                              log.car.model,
                              " ",
                              log.car.year,
                            ]}
                          </td>
                          <td>{log.expenses.price}</td>
                          <td>{log.mileage}</td>
                          <td>
                            {log.expenses.refuels
                              ? log.expenses.refuels.liters
                              : ""}
                          </td>
                          <td>{log.expenses.date}</td>
                          <td>
                            {log.expenses.prolongedExpenses
                              ? log.expenses.prolongedExpenses.endDate
                              : ""}
                          </td>
                          <td>{log.expenses.recurringExpenses ? "Yes" : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Paper>{" "}
            </ScrollArea>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ExpenseIndex;
