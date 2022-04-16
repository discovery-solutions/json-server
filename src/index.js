import ServerTypes from "./server/";
import "utilities/constants";

global["json-server"] = {};

export default class Server {
  static run(json) {
    const servers = ServerTypes.setup(json);

    global["json-server"].json = json;

    return {
      name: json.name,
      servers: servers,
    }
  }
}
