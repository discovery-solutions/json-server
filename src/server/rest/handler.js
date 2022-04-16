import EntityHandler from "features/entity";
import Error from "utilities/error";
import { toJSON, toCSV } from "./utils";

export default class Handler {
  constructor({ format, port, type }) {
    this.format = format;
    this.type = type;
    this.port = port;

    return this.handler;
  }

  handler = (req, res) => {
    this.res = res;
    this.req = req;

    const isFileRequest = req.url.split(".").length > 1;

    if ( isFileRequest )
      return this.handleNotFound();

    const entity = new EntityHandler(req);

    if (entity.code === 200)
      return this.parse(entity.response, entity.code);

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
    const notFoundResponse = {
      status: false,
      code: 404,
      message: "Not Found"
    };

    return this.parse(notFoundResponse, 404);
  }

  send() {
    this.res.writeHead(this.code);
    this.res.end(this.response);
  }
}
