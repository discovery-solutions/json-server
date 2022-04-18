import Databases from "features/databases";
import ServerTypes from "server";
import "utilities/constants";

global["json-server"] = {};

export default class Server {
  constructor(json) {
    this.json = json;
    this.name = json.name;

    global["json-server"].json = json;
  }

  setup({ request }) {
    if (request.limit)
      SERVER.SETTINGS.REQUEST.LIMIT = request.limit;
  }

  async run() {
    this.databases = new Databases(this.json);
    this.servers = await ServerTypes.setup(this.json);
  }
}
