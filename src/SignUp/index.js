import { useDisclosure } from "@mantine/hooks";
import {
  PasswordInput,
  Stack,
  TextInput,
  Space,
  Container,
  Title,
  Group,
  Button,
} from "@mantine/core";
import Header from "../Header";

export default function SignUp() {
  const [visible, { toggle }] = useDisclosure(false);
  return (
    <>
      <Container>
        <Header title="Sign Up" page="signup" text="Get start now" />
        <Space h="60px" />
        <Stack>
          <TextInput label="Name" placeholder="Denish" />
          <TextInput label="Email" placeholder="xxx@gmail.com" />
          <PasswordInput
            label="Password"
            placeholder="******"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="******"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Group position="center">
            <Button>Sign Up Now</Button>
          </Group>
        </Stack>
      </Container>
    </>
  );
}
