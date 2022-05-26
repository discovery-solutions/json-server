import EventListener, { Events } from "utilities/event-listener";
import { getBody } from "./utils";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

eventListener.set({ priority: true }, async function configuration(req, res) {
  // Setting json() function
  res.json = data => {
    res.payload = data;
    return res;
  }

  // Setting code() function
  res.code = statusCode => {
    res.statusCode = statusCode;
    return res;
  }

  // Extracting body
  try {
    req.body = await getBody(req);
  } catch (e) {
    console.log(e);
    return this.parse(422);
  }
});
