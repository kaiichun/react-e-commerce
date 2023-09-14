import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getCartItems, removeFromCart } from "../api/cart";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
  Divider,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Header from "../Header";

export default function Cart() {
  const queryClient = useQueryClient();
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  // console.log(queryClient.getQueryData(["cart"]));
  //   console.log(getCartItems());
  // console.log(cart);

  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [productList, setProductList] = useState([]);

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };
  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((c) => c !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Deleted",
        color: "green",
      });
      setCheckAll(false);
    },
  });

  const calculateTotal = () => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  };

  return (
    <Container>
      <Space h="50px" />
      <Title align="center">Welcome To My Store</Title>
      <Space h="5px" />
      <Title align="center">வண்டி</Title>
      <Header />
      <Space h="35px" />
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>
              <Checkbox
                type="checkbox"
                checked={checkAll}
                disabled={cart && cart.length > 0 ? false : true}
                onChange={(event) => {
                  checkBoxAll(event);
                }}
              />
            </th>
            <th>Product</th>
            <th></th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>
              <Group position="right">Action</Group>
            </th>
          </tr>
        </thead>
        <tbody>
          {cart ? (
            cart.map((c) => {
              return (
                <tr key={c._id}>
                  <td>
                    <Checkbox
                      checked={
                        checkedList && checkedList.includes(c._id)
                          ? true
                          : false
                      }
                      type="checkbox"
                      onChange={(event) => {
                        checkboxOne(event, c._id);
                      }}
                    />
                  </td>

                  <td>
                    {c.image && c.image !== "" ? (
                      <>
                        <Image
                          src={"http://localhost:8880/" + c.image}
                          width="10vw"
                          height="10vh"
                        />
                      </>
                    ) : (
                      <Image
                        src={
                          "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                        }
                        width="10vw"
                        height="8vh"
                      />
                    )}
                  </td>
                  <td> {c.name}</td>
                  <td>${c.price}</td>
                  <td>{c.quantity}</td>
                  <td>${c.price * c.quantity}</td>
                  <td>
                    <Group position="right">
                      <Button
                        color="red"
                        size="sm"
                        disabled={
                          checkedList && checkedList.includes(c._id)
                            ? false
                            : true
                        }
                        onClick={(event) => {
                          deleteMutation.mutate(c._id);
                        }}
                      >
                        Remove
                      </Button>
                    </Group>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>No Product Add Yet!</td>
            </tr>
          )}
          <tr>
            <td colSpan={5} className="text-end me-5"></td>
            <td>
              <strong>${calculateTotal()}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <Space h="25px" />
      <Group position="apart">
        <Button
          color="red"
          size="sm"
          className="ms-2"
          disabled={checkedList && checkedList.length > 0 ? false : true}
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Delete Selected
        </Button>
        <Button>Checkout</Button>
      </Group>
    </Container>
  );
}
