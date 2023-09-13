import { Group, Space, Button } from "@mantine/core";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div className="header">
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" color="blue" size="xs" radius="50px">
          Home
        </Button>
        <Button
          component={Link}
          to="/Cart"
          color="blue"
          size="xs"
          radius="50px"
        >
          Cart
        </Button>
        <Button
          component={Link}
          to="/Order"
          color="blue"
          size="xs"
          radius="50px"
        >
          Order
        </Button>
      </Group>
    </div>
  );
}
