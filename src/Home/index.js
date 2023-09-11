import { Container, Title, Space, Divider } from "@mantine/core";
import Product from "../Product";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="black">
        Welcome to My Store
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      <Product />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
