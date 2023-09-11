import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchProduct = async (category) => {
  // 3. trigger new API
  const response = await axios.get(
    "http://localhost:8880/products?" +
      (category !== "" ? "category=" + category : "")
  );
  return response.data; // products data from express
};

const deleteProduct = async (product_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:8880/products/" + product_id,
  });
  return response.data;
};

function Product() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  // 4. movies data will be updated depending on the genre selected
  const {
    isLoading,
    isError,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProduct(category),
  });

  const memoryProducts = queryClient.getQueryData(["products", ""]);
  const categoryOptions = useMemo(() => {
    let options = [];
    // loop through all the movies to get the genre from each movie
    if (memoryProducts && memoryProducts.length > 0) {
      memoryProducts.forEach((product) => {
        // to make sure the genre wasn't already in the options
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [memoryProducts]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // this will be triggered when API is successfully executed
      // ask the react query to retrigger the API
      queryClient.invalidateQueries({
        queryKey: ["products", category],
      });
      // show movie is deleted message
      notifications.show({
        title: "Product already Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Products
        </Title>
        <Button component={Link} to="/product_add" color="green">
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {products
          ? products.map((product) => {
              return (
                <Grid.Col key={product._id} xs={12} sm={6} lg={4}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{product.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">{product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="10px" />
                    <Button fullWidth radius="7px">
                      Add to Cart
                    </Button>
                    <Space h="12px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/product/" + product._id}
                        color="blue"
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate(product._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Product;
