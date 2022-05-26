import EventListener, { Events } from "utilities/event-listener";
import { getJSON } from "utilities/utils";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Access controller for routes
eventListener.set(async function cors(req, res) {
  if (getJSON().cors) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PATCH, DELETE");
    res.setHeader("Access-Control-Max-Age", 1000 * 60 * 60 * 24 * 30); // 30 days
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");

    if (req.method === "OPTIONS")
      res.code(200).json({ message: "OK" });
  }
});
