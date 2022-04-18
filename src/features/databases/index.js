import MongoDB from "./mongo";
import * as Utils from "utilities/utils";

let databases = {};

export default class Databases {
  constructor(json) {
    this.list = Utils.getArray(json.database);

    this.setup();
  }

  async setup() {
    for (const item of this.list) {
      try {
        const db = new MongoDB(item);

        await db.connect();

        databases[item.key] = db;
      } catch (e) {
        console.log(e);
        databases[item.key] = e;
      }
    }
  }

  static get(key) {
    return databases[key];
  }
}
