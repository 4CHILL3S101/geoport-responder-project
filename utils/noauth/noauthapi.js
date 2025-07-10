import axios from "axios";
import { SERVER_PORT, SERVER_IP ,SERVER_URL} from "@env";

export default api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
