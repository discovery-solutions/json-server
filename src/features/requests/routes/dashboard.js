import jwt from "jsonwebtoken";
import AuthTokenHandler from "features/auth/token";
import Requests from "features/requests";
import * as Utils from "utilities/utils";
import { Entities } from "utilities/constants";
import { ROUTES } from "../constants";

const [ AUTH, GET ] = ROUTES.DASHBOARD;
const requests = new Requests();

requests.use(...GET, async (req, res) => {
  const { dashboard: { access, ...dashboard } } = Utils.getJSON();

  return res.json({
    message: "API Running",
    dashboard: dashboard,
  });
});

requests.use(...AUTH, async (req, res) => {
  const { dashboard: { access: [ data ]} } = Utils.getJSON();
  const { password, login } = data;

  const validPassword = data.password === req.body.password;
  const validLogin = data.login === req.body.login;

  if (!validPassword || !validLogin)
    return res.code(401).json({ message: "Invalid Credentials" });

  const authTokenHandler = new AuthTokenHandler(req);
  const access = authTokenHandler.generate();

  // Signing token
  const authToken = jwt.sign({ access, data }, Entities.ADMIN.auth.secret);

  // Recording access token on DB
  await authTokenHandler.register(data.login, Entities.ADMIN.name, authToken);

  // Returning token
  res.setHeader("x-auth-token", authToken);

  return res.json({
    admin: {
      login: data.login,
      name: data.name,
    }
  });
});
