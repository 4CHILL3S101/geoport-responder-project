import axios from "axios";
import { SERVER_PORT, SERVER_IP } from "@env";

export default api = axios.create({
  baseURL: `http://${SERVER_IP}:${SERVER_PORT}`,
  headers: {
    "Content-Type": "application/json",
  },
});
