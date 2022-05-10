import EventListener, { Events } from "utilities/event-listener";
import AuthTokenHandler from "../token";
import { WHITELIST } from "../constants";
import { getJSON } from "utilities/utils";
import Requests from "features/requests";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Identify user from token
eventListener.set(async (req, res) => {
  const { entities } = getJSON();

  const splitted = req.url.split("/");
  const [ base = "", params = "" ] = req.url.split("?");

  res.send = data => {
    req.paload = data;
    return true;
  }

  res.error = code => {
    req.statusCode = code;
    return true;
  }

  req.url = {
    value: req.url,
    base: base,
    splitted: splitted.filter(item => item.length > 0),
    params: params.split("&").reduce((obj, item) => {
      const [ key, value ] = item.split("=");

      obj[key] = value;

      return obj;
    }, {})
  }

  req.entity = entities.find(e => e.name === req.url.splitted[0]) || false;

  const authToken = req.headers["x-auth-token"];

  if (typeof authToken === "undefined")
    return true;

  if (Requests.inWhitelist(req))
    return true;

  const authTokenHandler = new AuthTokenHandler(req);
  const [ auth, type ] = await authTokenHandler.validate(authToken);

  req.auth = auth;
  req.entity = entities.find(e => e.name === type) || false;
});
