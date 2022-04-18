import * as Utils from "utilities/utils";
import Rest from "./rest/";

export default class ServerTypes {
  static async setup({ config }) {
    const servers = [];

    for (const configItem of Utils.getArray(config)) {
      if (configItem.type === CONSTANTS.SERVER.TYPES.REST) {
        const server = new Rest(configItem);

        servers.push( server );
      }
    }

    return servers;
  }
}
