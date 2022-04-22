import { MongoClient } from "mongodb";
import CRUD from "./CRUD";

export default class MongoDB extends CRUD {
  constructor({ uri, name, key }) {
    super();

    this.client = new MongoClient(uri);
    this.name = name;
    this.uri = uri;
    this.key = key;

    return this;
  }

  async connect() {
    try {
      await this.client.connect();

      this.db = this.client.db(this.name);

      return this;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async setEntity(entity) {
    try {
      await this.db.createCollection(entity);
    } catch (e) {
      // console.log(e);
    }

    this.entity = entity;
    this.collection = this.db.collection(entity);
  }

  async count(query = {}) {
    return this.collection.count(query);
  }

  async validateID(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
}
