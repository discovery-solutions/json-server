import { METHODS } from "features/entity/constants";
import { EVENTS } from "utilities/event-listener";
import { AUTH } from "features/auth/constants";

global.CONSTANTS = {
  SERVER: {
    METHODS: METHODS,
    EVENTS: EVENTS,
    AUTH: AUTH,
    SECRET: "DEFAUL-SECRET-JSON-SERVER",
    TYPES: {
      REST: "rest",
      SOCKET: "socket",
    },
    FORMATS: {
      JSON: "json",
      CSV: "csv",
    },
    SETTINGS: {
      DATABASE: {
        DEFAULT: "custom-db",
        AUTH: "json-server-auth",
      },
      REQUEST: {
        LIMIT: 10,
      }
    }
  }
};
