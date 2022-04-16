import Rest from "./rest/";
import * as Utils from "utilities/utils";

export default class ServerTypes {
  static setup({ config }) {
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
