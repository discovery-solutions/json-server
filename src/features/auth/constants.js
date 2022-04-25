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
  },
  PERMISSIONS: {
    INSERT: "insert",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
    GET: "get",
  }
}
