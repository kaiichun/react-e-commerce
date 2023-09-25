import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
  Select,
  Divider,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import Header from "../Header";
import { fetchOrders, deleteOrder, updateStatus, getOrder } from "../api/order";
import axios from "axios";

export default function Orders() {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  console.log(orders);

  const updateMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateStatus = async (order, valueOne) => {
    console.log(valueOne);
    updateMutation.mutate({
      id: order._id,
      data: JSON.stringify({
        status: valueOne,
      }),
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Orders Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Container>
        <Header title="My Orders" page="orders" text="Historial de pedidos" />
        <Space h="30px" />
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td>
                        {o.customerName}
                        <br />({o.customerEmail})
                      </td>
                      <td>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <Group>
                              {product.image && product.image !== "" ? (
                                <>
                                  <Image
                                    src={
                                      "http://localhost:8880/" + product.image
                                    }
                                    width="100px"
                                  />
                                </>
                              ) : (
                                <Image
                                  src={
                                    "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                  }
                                  width="100px"
                                />
                              )}
                              <p>{product.name}</p>
                            </Group>
                          </div>
                        ))}
                      </td>
                      <td>{o.totalPrice}</td>
                      <td>
                        <Select
                          checkIconPosition="right"
                          dropdownOpened
                          pb={150}
                          width="100px"
                          value={o.status}
                          onChange={(valueOne) =>
                            handleUpdateStatus(o, valueOne)
                          }
                          placeholder={o.status}
                          disabled={o.status === "Pending"}
                          data={[
                            "Pending",
                            "Paid",
                            "Failed",
                            "Shipped",
                            "Delivered",
                          ]}
                        />
                      </td>
                      <td>{o.paid_at}</td>
                      <td>
                        {o.status !== "Pending" ? (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate(o._id);
                            }}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
        <Group position="center" pt="20px">
          <Button component={Link} to="/">
            Continue Shopping
          </Button>
        </Group>
      </Container>
    </>
  );
}
