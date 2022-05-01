import { PORT } from "./constants";
import axios from "axios";

const BASE_URL = "http://192.168.15.119:";

export default axios.create({ baseURL: BASE_URL + PORT });
