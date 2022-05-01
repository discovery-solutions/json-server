import Requests from "features/requests";
import { AUTH } from "../constants";

const HOME = AUTH.REQUESTS.HOME;
const requests = new Requests();

requests.use(HOME.METHOD, HOME.PATH, async (req, res) => {
  res.payload = {
    message: "API Running"
  }
});
