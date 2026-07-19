import axios from "axios";

const BASE_URL = "http://localhost:5000/api/theaters";

export const getNearbyTheaters = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/nearby`, {
    params: { lat, lon },
  });

  return response.data;
};

export const getCityTheaters = async (city) => {
  const response = await axios.get(`${BASE_URL}/city`, {
    params: { city },
  });

  return response.data;
};