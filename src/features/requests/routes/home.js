import Requests from "features/requests";
import { ROUTES } from "../constants";

const [ method, path ] = ROUTES.HOME;
const requests = new Requests();

requests.use(method, path, async (req, res) => {
  return res.json({
    message: "API Running"
  });
});
