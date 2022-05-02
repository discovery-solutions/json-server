import EventListener, { Events } from "utilities/event-listener";
import AuthTokenHandler from "../token";
import { WHITELIST } from "../constants";
import { getJSON } from "utilities/utils";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Identify user from token
eventListener.set(async (req, res) => {
  const { entities } = getJSON();

  req.url = {
    value: req.url,
    splitted: req.url.split("/").filter(item => item.length > 0),
  }

  req.entity = entities.find(e => e.name === req.url.splitted[0]) || false;

  const authToken = req.headers["x-auth-token"];

  if (typeof authToken === "undefined")
    return true;

  if (WHITELIST.includes(req.url.value))
    return true;

  const authTokenHandler = new AuthTokenHandler(req);
  req.auth = await authTokenHandler.validate(authToken);
});
