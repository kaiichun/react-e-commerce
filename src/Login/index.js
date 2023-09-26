import styled from "styled-components";
import {
  PasswordInput,
  TextInput,
  Group,
  Container,
  Title,
  Space,
  Button,
} from "@mantine/core";
import Header from "../Header";

export default function Login() {
  return (
    <Container>
      <Header title="Login" page="login" text="" />
      <Space h="60px" />
      <TextInput label="Email" placeholder="xxx@gmail.com" />
      <Space h="10px" />
      <PasswordInput label="Password" placeholder="******" />
      <Space h="30px" />
      <Group position="center">
        <Button>Login</Button>
      </Group>
    </Container>
  );
}
