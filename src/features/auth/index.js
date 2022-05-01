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
  const { PERMISSIONS, REQUESTS } = CONSTANTS.SERVER.AUTH;

  const permissionByURL = {
    oldest: PERMISSIONS.LIST,
    latest: PERMISSIONS.LIST,
    update: PERMISSIONS.UPDATE,
    delete: PERMISSIONS.DELETE,
    insert: PERMISSIONS.INSERT,
    list: PERMISSIONS.LIST,
    get: PERMISSIONS.GET,
  }

  const doesNeedAuthentication = getJSON().entities.filter(entity => {
    return typeof entity.auth === "object";
  }).length > 0;

  if (doesNeedAuthentication === false)
    return false;

  for (const key of Object.keys(URL)) {
    if ( URL[key](req) ) {
      const permissions = req.entity?.auth?.permission;

      if (permissions) {
        const permission = permissionByURL[key] || PERMISSIONS.LIST;
        const authPermission = permissions[req.entity.name] || permissions["*"];

        const isAuthenticated = !!req.auth;
        const hasPermission = !!authPermission[permission];

        if (hasPermission && isAuthenticated)
          return false;
      }
    }
  }

  const whitelist = Object.values(REQUESTS).map(item => item.PATH);

  if (whitelist.includes(req.url.value))
    return false;

  res.statusCode = 401;
  return true;
});
