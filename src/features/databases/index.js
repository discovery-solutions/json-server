import CustomDB from "./custom";
import MongoDB from "./mongo";
import * as Utils from "utilities/utils";

let databases = {};

export default class Databases {
  constructor(json) {
    this.list = Utils.getArray(json.database);

    if (this.list.length === 0) {
      this.list.push({
        name: CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT,
        key: CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT,
        type: "custom"
      });
    }

    this.setup();
  }

  async setup() {
    for (const item of this.list) {
      try {
        const DBClass = this.getClassByType(item.type);
        const db = new DBClass(item);

        await db.connect();

        databases[item.key] = db;
      } catch (e) {
        console.log(e);
        databases[item.key] = e;
      }
    }

    if (Object.keys(databases).length === 0)
      console.log("No databases connected");
  }

  getClassByType(type) {
    switch (type) {
      case "mongo-db":
      case "mongodb":
      case "mongoDB":
      case "mongo": {
        return MongoDB;
      }
      default:
        return CustomDB;
    }
  }

  static get(key = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT) {
    return databases[key];
  }
}
