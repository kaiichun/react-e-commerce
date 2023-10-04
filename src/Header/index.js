import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Avatar,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearCartItems } from "../api/cart";

export default function Header({ title, page = "", text = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  return (
    <div className="header">
      <Space h="50px" />
      <Title align="center">{title}</Title>
      <Title align="center">{text}</Title>
      <Space h="35px" />
      <Group position="apart">
        <Group position="left">
          <Button
            component={Link}
            to="/"
            variant={page === "home" ? "filled" : "light"}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/cart"
            variant={page === "cart" ? "filled" : "light"}
          >
            Cart
          </Button>
          <Button
            component={Link}
            to="/orders"
            variant={page === "orders" ? "filled" : "light"}
          >
            My Orders
          </Button>
        </Group>
        <Group position="right">
          {cookies && cookies.currentUser ? (
            <>
              <Group>
                <Avatar
                  src=":https://tacm.com/wp-content/uploads/2018/01/no-image-available.jpeg"
                  radius="xl"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {cookies.currentUser.name}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {cookies.currentUser.email}
                  </Text>
                </div>
              </Group>
              <Button
                variant={"light"}
                onClick={() => {
                  // clear the currentUser cookie to logout
                  removeCookies("currentUser");
                  clearCartItems();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant={page === "login" ? "filled" : "light"}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={page === "signup" ? "filled" : "light"}
              >
                Sign Up
              </Button>
            </>
          )}
        </Group>
      </Group>
      <Space h="20px" />
      <Divider />
    </div>
  );
}
