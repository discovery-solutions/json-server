export const AUTH = {
  TYPES: {
    OATH: "oauth",
    JWT: "jwt",
  },
  REQUESTS: {
    LOGIN: {
      PATH: "/system/auth",
      METHOD: "POST",
    },
    REFRESH: {
      PATH: "/system/refresh",
      METHOD: "POST",
    },
    HOME: {
      PATH: "/",
      METHOD: "GET",
    },
  },
  PERMISSIONS: {
    INSERT: "insert",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
    GET: "get",
  }
}
