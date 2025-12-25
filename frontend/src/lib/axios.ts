import axios from "axios";

export const api = axios.create({
  baseURL: "https://strong-sunburst-ca3c1a.netlify.app/login",
  headers: {
    "Content-Type": "application/json",
  },
});
