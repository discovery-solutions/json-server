import EventListener, { Events } from "utilities/event-listener";
import AuthTokenHandler from "./token";
import { getJSON } from "utilities/utils";
import URL from "features/entity/url";
import "./routes/";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Authenticate users from token
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

  const authTokenHandler = new AuthTokenHandler(req);

  req.auth = await authTokenHandler.validate(authToken);
});

// Access controller for routes
eventListener.set(async (req, res) => {
  const permissionByURL = {
    oldest: CONSTANTS.SERVER.AUTH.PERMISSIONS.LIST,
    latest: CONSTANTS.SERVER.AUTH.PERMISSIONS.LIST,
    update: CONSTANTS.SERVER.AUTH.PERMISSIONS.UPDATE,
    delete: CONSTANTS.SERVER.AUTH.PERMISSIONS.DELETE,
    insert: CONSTANTS.SERVER.AUTH.PERMISSIONS.INSERT,
    list: CONSTANTS.SERVER.AUTH.PERMISSIONS.LIST,
    get: CONSTANTS.SERVER.AUTH.PERMISSIONS.GET,
  }

  for (const key of Object.keys(URL)) {
    if ( URL[key](req) ) {
      const permissions = req.entity?.auth?.permission;

      const permission = permissionByURL[key] || CONSTANTS.SERVER.AUTH.PERMISSIONS.LIST;
      const authPermission = permissions[req.entity.name] || permissions["*"];

      const isAuthenticated = !!req.auth;
      const hasPermission = !!authPermission[permission];

      if (hasPermission && isAuthenticated)
        return false;
    }
  }

  res.statusCode = 401;
  return true;
});
