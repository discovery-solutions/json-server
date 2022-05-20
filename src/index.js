import Requests from "features/requests";
import Databases from "features/databases";
import * as Utils from "utilities/utils";
import ServerTypes from "server";
import "utilities/constants";

export default class Server {
  constructor(json) {
    Utils.injectJSON(json);

    this.json = json;
    this.name = json.name;
    this.routes = new Requests();

    Utils.setJSON(json);
    global.logger = json.logger || console.log;
  }

  setup({ request, database, language }) {
    if (request.limit)
      CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT = request.limit;

    if (database?.default)
      CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT = database.default;

    if (language)
      CONSTANTS.SETTINGS.LANGUAGE.DEFAULT = language;
  }

  async run() {
    try {
      this.databases = new Databases(this.json);
      this.servers = new ServerTypes(this.json);
    } catch (e) {
      logger(e);
    }
  }

  getServerByPort(port) {
    return this.servers.find(server => server.port === port);
  }
}
