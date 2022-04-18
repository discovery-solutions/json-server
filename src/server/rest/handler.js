import Entity from "features/entity";
import Error from "utilities/error";
import { toJSON, toCSV } from "./utils";

export default class Handler {
  constructor({ format, port, type, database }) {
    this.format = format;
    this.type = type;
    this.port = port;
    this.database = database;

    return this.handler;
  }

  handler = async (req, res) => {
    this.res = res;
    this.req = req;

    const isFileRequest = req.url.split(".").length > 1;

    if ( isFileRequest )
      return this.handleNotFound();

    const entity = await Entity.handle(req, this.database);

    if (entity.code === 200)
      return this.parse(entity.response, entity.code);

    if (entity.code !== 404)
      return this.parse(Error.get(entity.code), entity.code);

    return this.handleNotFound();
  }

  parse(response, code) {
    this.code = code;
    this.response = {
      ...Error.get(code),
      ...response,
    };

    switch (this.format) {
      case CONSTANTS.SERVER.FORMATS.CSV: {
        this.res.setHeader("Content-Type", "text/csv");
        this.res.setHeader("Content-Disposition", "attachment;filename=response.csv");

        this.response = toCSV(response);
        break;
      }
      case CONSTANTS.SERVER.FORMATS.JSON:
      default: {
        this.res.setHeader("Content-Type", "application/json");

        this.response = toJSON(this.response);
        break;
      }
    }

    return this.send();
  }

  handleNotFound() {
    const notFoundResponse = Error.get(404);

    return this.parse(notFoundResponse, 404);
  }

  send() {
    this.res.writeHead(this.code);
    this.res.end(this.response);
  }
}
