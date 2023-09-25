import axios from "axios";

const API_URL = "http://localhost:8880";

export const verifyPayment = async (data) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/payment",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};
