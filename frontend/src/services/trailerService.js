import api from "./api";

export const getMovieTrailer = async (id) => {
  const response = await api.get(`/trailer/${id}`);
  return response.data.trailer;
};