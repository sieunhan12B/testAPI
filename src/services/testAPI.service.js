import axios from "axios";

const API_URL = "https://67c5a2b7351c081993fad09c.mockapi.io/Users";

export const testAPI = {
  getListUser: () => axios.get(API_URL),
  addUser: (user) => axios.post(API_URL, user),
  updateUser: (userId, user) => axios.put(`${API_URL}/${userId}`, user),
  deleteUser: (userId) => axios.delete(`${API_URL}/${userId}`),
};
