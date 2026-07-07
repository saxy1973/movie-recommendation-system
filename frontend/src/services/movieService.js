import api from "./api";
import axios from "axios";

const API = "http://localhost:5000/api";

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

export const getTrendingMovies = async () => {
  const response = await axios.get(`${API}/trending`);
  return response.data;
};

export const getComingSoonMovies = async () => {
  const response = await axios.get(`${API}/coming-soon`);
  return response.data;
};