import EventListener, { Events } from "utilities/event-listener";
import Requests from "features/requests";
import Entity from "features/entity";
import Error from "utilities/error";
import { toJSON, toCSV, getBody } from "./utils";

export default class Handler {
  constructor({ format, port, type, database }) {
    this.database = database;
    this.format = format;
    this.type = type;
    this.port = port;

    return this.handler;
  }

  handler = async (req, res) => {
    // Extraction body
    try {
      req.body = await getBody(req);
    } catch (e) {
      return this.parse(422);
    }

    this.res = res;
    this.req = req;

    this.res.json = data => {
      this.res.payload = {
        ...Error.get(200),
        ...data,
      };

      return true;
    }

    this.req.server = {
      database: this.database,
      format: this.format,
      type: this.type,
      port: this.port,
    }

    logger("REQUEST", req.method, req.url, req.body || "");

    // Calling events for before actions
    const middlewares = [
      new EventListener(Events.REQUEST.BEFORE.PROCESS),
      new Requests(),
    ];

    for (const middleware of middlewares) {
      const status = await middleware.run(this.req, this.res);

      const isChanged = (
        status !== false ||
        this.res.statusCode !== 200 ||
        typeof this.res.payload === "object"
      );

      if (isChanged)
        return this.parse(this.res.statusCode, this.res.payload);
    }

    // Handling request with entities
    const entity = await Entity.handle(this.req, this.database);

    if (entity.code === 200)
      return this.parse(entity.code, entity.response);

    if (entity.code !== 404)
      return this.parse(entity.code, Error.get(entity.code));

    // Handling not found
    return this.handleNotFound();
  }

  parse(code, response = {}) {
    this.code = code;

    const hasPreSettedHeader = !!this.res.getHeader("Content-Type");
    const format = hasPreSettedHeader ? undefined : this.format;

    if (format) {
      this.response = {
        ...Error.get(code),
        ...response,
      };
    } else if (Object.keys(response).length > 0) {
      this.response = response;
    }

    switch (format) {
      case CONSTANTS.SERVER.FORMATS.CSV: {
        this.res.setHeader("Content-Type", "text/csv");
        this.res.setHeader("Content-Disposition", "attachment;filename=response.csv");

        this.response = toCSV(response);
        break;
      }
      case CONSTANTS.SERVER.FORMATS.JSON: {
        this.res.setHeader("Content-Type", "application/json");

        this.response = toJSON(this.response);
        break;
      }
      default: {
        break;
      }
    }

    return this.send();
  }

  handleNotFound() {
    return this.parse(404, Error.get(404));
  }

  send() {
    logger("RESPONSE", this.req.method, this.code, this.req.url.base, this.response || "");

    this.res.writeHead(this.code, this.res.getHeaders());

    if (this.response)
      return this.res.end(this.response);

    return this.res.end();
  }
}
