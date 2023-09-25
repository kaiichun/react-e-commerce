import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProduct, updateProduct, uploadProductImage } from "../api/products";
import Header from "../Header";

// const getProduct = async (id) => {
//   const response = await axios.get("http://localhost:8880/products/" + id);
//   return response.data;
// };

// const updateProduct = async ({ id, data }) => {
//   console.log(data);
//   const response = await axios({
//     method: "PUT",
//     url: "http://localhost:8880/products/" + id,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   });
//   return response.data;
// };

// const uploadProductImage = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);
//     const response = await axios({
//       method: "POST",
//       url: API_URL + "/images",
//       headers: {
//         "Content-Type": "multipart/form-data"
//       },
//       data: formData
//     });
//     return response.data;
//   };

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    onSuccess: (data) => {
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setCategory(data.category);
      setImage(data.image);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "Product is updated successfully",
        color: "green",
      });
      // redirect back to home page
      // 重定向回主页
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateProduct = async (event) => {
    // 阻止表单默认提交行为
    event.preventDefault();
    // 使用updateMutation mutation来更新商品信息
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        name: name,
        description: description,
        price: price,
        category: category,
        image: image,
      }),
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      setUploading(false);
      notifications.show({
        title: "Image uploaded successfully",
        color: "yellow",
      });
    },
    onError: (error) => {
      setUploading(false);
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
  };

  return (
    <Container>
      <Space h="50px" />
      <Header title="Edit Product information" />
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <LoadingOverlay visible={isLoading} />
        <TextInput
          value={name}
          placeholder="Enter the product name here"
          label="Name"
          description="The name of the product"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        {image && image !== "" ? (
          <>
            <Image
              src={"http://localhost:8880/" + image}
              width="50vw"
              height="50vh"
            />
            <Button color="dark" mt="15px" onClick={() => setImage("")}>
              Remove Image
            </Button>
          </>
        ) : (
          <Dropzone
            multiple={false}
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              handleImageUpload(files);
            }}
          >
            <Title order={4} align="center" py="20px">
              Click to upload or Drag image to upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <TextInput
          value={description}
          placeholder="Enter the description here"
          label="Description"
          description="The description for the product"
          withAsterisk
          onChange={(event) => setDescription(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={price}
          placeholder="Enter the price here"
          label="Price(USD)"
          precision={2}
          description="What is a price"
          withAsterisk
          onChange={setPrice}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the category at here"
          label="Category"
          description="What is the category for this"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
        />

        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateProduct}>
          Update
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
export default ProductEdit;
