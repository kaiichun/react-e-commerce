import { Title } from "@mantine/core";
import styled from "styled-components";

const Heading = styled.h1`
  color: rgb(191, 79, 116);
  text-align: center;
  strong {
    color: black;
  }
`;

export default function Login() {
  return (
    <>
      <Title
        order={1}
        align="center"
        color="red"
        sx={{
          color: "rgb(191, 79, 116)",
          "& .bold": {
            color: "black",
          },
          "&:hover": {
            color: "red",
          },
          "@media (max-width: 48em)": {
            fontSize: "0.9rem",
          },
        }}
      >
        Login to <strong className="bold">Your</strong> Account
      </Title>
      <Heading>
        Login to <strong>Your</strong> Account
      </Heading>
    </>
  );
}
