import { EVENTS } from "utilities/event-listener";

global.CONSTANTS = {
  SERVER: {
    EVENTS: EVENTS,
    TYPES: {
      REST: "rest",
      SOCKET: "socket",
    },
    FORMATS: {
      JSON: "json",
      CSV: "csv",
    },
  }
};
