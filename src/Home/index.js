import { Container, Title, Space, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";
import Products from "../Product";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center">Welcome To My Store</Title>
      <Header />
      <Space h="20px" />
      <Divider />
      <Space h="30px" />
      <Products />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
