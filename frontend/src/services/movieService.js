import api from "./api";

export const searchMovies = async (query) => {
  const response = await api.get(`/search?query=${query}`);
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await api.get("/top-rated");
  return response.data;
};