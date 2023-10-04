// export const API_URL = "http://localhost:8880";

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "http://10.1.104.3:5001";
