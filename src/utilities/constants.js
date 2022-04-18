import { METHODS } from "features/entity/constants";
import { EVENTS } from "utilities/event-listener";

global.CONSTANTS = {
  SERVER: {
    METHODS: METHODS,
    EVENTS: EVENTS,
    TYPES: {
      REST: "rest",
      SOCKET: "socket",
    },
    FORMATS: {
      JSON: "json",
      CSV: "csv",
    },
    SETTINGS: {
      REQUEST: {
        LIMIT: 10,
      }
    }
  }
};
