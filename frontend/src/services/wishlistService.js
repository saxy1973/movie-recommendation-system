import api from "./api";

export const addToWishlist = (userId, movieId) => {
  return api.post("/wishlist/add", {
    userId,
    movieId,
  });
};

export const getWishlist = (userId) => {
  return api.get(`/wishlist/${userId}`);
};

export const removeFromWishlist = (userId, movieId) => {
  return api.delete(`/wishlist/${userId}/${movieId}`);
};