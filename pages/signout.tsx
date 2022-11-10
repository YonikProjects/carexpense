import type { NextPage } from "next";
import { Text, Container } from "@mantine/core";
import { useEffect } from "react";
import { removeJWTdata } from "../components/etc/cookies";

const SignOut: NextPage = () => {
  useEffect(() => {
    removeJWTdata();
  }, []);
  return (
    <Container>
      <Text>Logging you out</Text>
    </Container>
  );
};

export default SignOut;
