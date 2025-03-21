import axios from "axios";

const API_URL = "https://67dccca5e00db03c4068f1e3.mockapi.io/users";

export const testAPI = {
  getListUser: () => axios.get(API_URL),
  getUserById: (id) => axios.get(`${API_URL}/${id}`),

  addUser: (user) => axios.post(API_URL, user),
  updateUser: (id, user) => axios.put(`${API_URL}/${id}`, user),
  deleteUser: (id) => axios.delete(`${API_URL}/${id}`),
};
