import axios from "axios";

export const fetchMovies = async (genre, rating) => {
  // 3. trigger new API
  const response = await axios.get(
    "http://localhost:8080/movies?" +
      (genre !== "" ? "genre=" + genre : "") +
      (rating !== "" ? "&rating=" + rating : "")
  );
  return response.data; // movies data from express
};

export const getMovie = async (id) => {
  const response = await axios.get("http://localhost:8080/movies/" + id);
  return response.data;
};

export const addMovie = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:8080/movies",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const updateMovie = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:8080/movies/" + id,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const deleteMovie = async (movie_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:8080/movies/" + movie_id,
  });
  return response.data;
};
