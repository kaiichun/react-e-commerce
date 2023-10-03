import { Container, Title, Space, Divider } from "@mantine/core";
import { Link } from "react-router-dom";

import Product from "../Product";
import Header from "../Header";
import { useCookies } from "react-cookie";

function Home() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  return (
    <Container>
      <Header title={"Welcome To My Store"} page="home" text="வீடு" />
      <Space h="30px" />
      <Product />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
