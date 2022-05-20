import { METHODS } from "features/entity/constants";
import { Events } from "utilities/event-listener";
import { AUTH } from "features/auth/constants";
import { DOCS } from "features/docs/constants";

const CONSTANTS = {
  SERVER: {
    METHODS: METHODS,
    EVENTS: Events,
    AUTH: AUTH,
    DOCS: DOCS,
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
      },
      LANGUAGE: {
        DEFAULT: "pt",
      }
    }
  }
};

export default CONSTANTS;

export const Entities = {
  ADMIN: {
    name: "json-admin",
    alias: "JsonAdmin",
    auth: {
      type: "jwt",
      fields: ["email", "password"],
      secret: "ADMIN-SECRET-FOR-AUTH",
      permission: {
        "*": {
          insert: true,
          update: true,
          delete: true,
          list: true,
          get: true,
        }
      }
    },
    fields: {
      name: {
        type: "string",
        required: true
      },
      email: {
        type: "string",
        required: true
      },
      password: {
        type: "string",
        required: true,
        secure: true,
      },
    }
  }
}

global.CONSTANTS = CONSTANTS;
