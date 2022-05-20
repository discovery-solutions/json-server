import EventListener, { Events } from "utilities/event-listener";
import * as Utils from "utilities/utils";
import Requests from "features/requests";
import URL from "features/entity/url";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Access controller for routes
eventListener.set(async function authentication(req, res) {
  const { PERMISSIONS } = CONSTANTS.SERVER.AUTH;

  const permissionByURL = {
    oldest: PERMISSIONS.LIST,
    latest: PERMISSIONS.LIST,
    update: PERMISSIONS.UPDATE,
    delete: PERMISSIONS.DELETE,
    insert: PERMISSIONS.INSERT,
    list: PERMISSIONS.LIST,
    get: PERMISSIONS.GET,
  }

  // Identify if API need authentication
  const doesNeedAuthentication = Utils.getJSON().entities.filter(entity => {
    return typeof entity.auth === "object";
  }).length > 0;

  if (doesNeedAuthentication === false)
    return false;

  // Identify public access entity routes
  if (Requests.inWhitelist(req))
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

  if ( Utils.isFile(req.url.value)?.length > 0 )
    return false;

  return res.code(401);
});
