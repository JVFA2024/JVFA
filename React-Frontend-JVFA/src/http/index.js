import axios from "axios";

export const http = axios.create({
  baseURL: "https://api-rwqk.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
