export const AUTH = {
  TYPES: {
    OATH: "oauth",
    JWT: "jwt",
  },
  ROUTES: {
    LOGIN: ["POST", "/system/auth"],
  },
  PERMISSIONS: {
    INSERT: "insert",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
    GET: "get",
  },
  PERMISSIONS_BY_METHODS: {
    POST: ["insert"],
    PATCH: ["update"],
    DELETE: ["delete"],
    LIST: ["list"],
    GET: ["get"],
  }
}

export const WHITELIST = Object.values(AUTH.ROUTES).map(item => item.PATH);
