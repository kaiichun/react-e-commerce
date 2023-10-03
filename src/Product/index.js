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
import { fetchProducts, deleteProduct } from "../api/products";
import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";

// const fetchProducts = async (category) => {
//   const response = await axios.get(
//     "http://localhost:8880/products?" +
//       (category !== "" ? "category=" + category : "")
//   );
//   return response.data; // products data from express
// };

// const deleteProduct = async (product_id = "") => {
//   const response = await axios({
//     method: "DELETE",
//     url: "http://localhost:8880/products/" + product_id,
//   });
//   return response.data;
// };

function Products() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState([]);
  // Use useQuery to fetch product data from the API. isLoading indicates whether it's currently loading, and data stores the returned product data.
  // 使用 useQuery 从 API 获取产品数据，isLoading 表示是否正在加载中，data 存储返回的产品数据
  const { isLoading, data: products } = useQuery({
    // Define a unique identifier for the query.
    // 定义查询的唯一标识符
    queryKey: ["products"],
    // The query logic; it calls the fetchProducts() function to retrieve product data.
    // 查询的逻辑，调用 fetchProducts() 函数来获取产品数据
    queryFn: () => fetchProducts(currentUser ? currentUser.token : ""),
  });
  // Use useQuery to fetch cart data from the API. data stores the returned cart data, which defaults to an empty array.
  // 使用 useQuery 从 API 获取购物车数据，data 存储返回的购物车数据，默认为空数组
  const { data: cart = [] } = useQuery({
    // Define a unique identifier for the query.
    // 定义查询的唯一标识符
    queryKey: ["cart"],
    // The query logic; it calls the getCartItems() function to retrieve cart data.
    // 查询的逻辑，调用 getCartItems() 函数来获取购物车数据
    queryFn: getCartItems,
  });

  useEffect(() => {
    /* 
      everything here will trigger when 
        - products is updated OR 
        - category is changed OR
        - sort is updated OR
        - perPage is updated OR
        - currentPage is updated
    */
    // method 1:
    // if (category !== "") {
    //   const filteredProducts = products.filter((p) => p.category === category);
    //   setCurrentProducts(filteredProducts);
    // } else {
    //   setCurrentProducts(products);
    // }

    // method 2:
    let newList = products ? [...products] : [];
    // filter by category
    if (category !== "") {
      newList = newList.filter((p) => p.category === category);
    }
    const total = Math.ceil(newList.length / perPage);
    // convert the total number into array
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    // sorting
    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "price":
        newList = newList.sort((a, b) => {
          return a.price - b.price;
        });
        break;
      default:
        break;
    }
    // do pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    /*
      const start =6;
      currentPage = 1
      perPage = 6
      start = 1-1 * 6 = 0
      end = 0 + 6
      currentPage = 2
      perPage = 6
      start = 2-1 * 6 = 6
      end = 6 + 6 = 12
      currentPage = 3
      perPage = 6
      start = 3-1 * 6 = 12
      end = 12 + 6 = 18
    */
    newList = newList.slice(start, end);

    setCurrentProducts(newList);
  }, [products, category, sort, perPage, currentPage]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [products]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      notifications.show({
        title: "Product is Deleted Successfully",
        color: "red",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Added to Cart",
        color: "green",
      });
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Products
        </Title>
        {isAdmin && (
          <Button component={Link} to="/product_add" color="green">
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Category</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">No Sorting</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(parseInt(event.target.value));
            // reset it back to page 1
            setCurrentPage(1);
          }}
        >
          <option value="6">6 Per Page</option>
          <option value="10">10 Per Page</option>
          <option value={9999999}>All</option>
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentProducts
          ? currentProducts.map((product) => {
              return (
                <Grid.Col key={product._id} lg={4} md={6} sm={6} xs={6}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{product.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">${product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Button
                      fullWidth
                      onClick={() => {
                        // pop a messsage if user is not logged in
                        if (cookies && cookies.currentUser) {
                          addToCartMutation.mutate(product);
                        } else {
                          notifications.show({
                            title: "Please login to proceed",
                            message: (
                              <>
                                <Button
                                  color="red"
                                  onClick={() => {
                                    navigate("/login");
                                    notifications.clean();
                                  }}
                                >
                                  Click here to login
                                </Button>
                              </>
                            ),
                            color: "red",
                          });
                        }
                      }}
                    >
                      Add To Cart
                    </Button>
                    {isAdmin && (
                      <>
                        <Space h="20px" />
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
                              deleteMutation.mutate({
                                id: product._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
      <Space h="40px" />
      <div>
        <span
          style={{
            marginRight: "10px",
          }}
        >
          Page {currentPage} of {totalPages.length}
        </span>
        {totalPages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
      <Space h="40px" />
    </>
  );
}

export default Products;
