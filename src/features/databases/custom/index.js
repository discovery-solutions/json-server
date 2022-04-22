import CRUD from "./CRUD";
import fs from "fs";

export default class CustomDB extends CRUD {
  constructor({ name, key }) {
    super();

    this.db = JSON.parse( fs.readFileSync("db.json", "utf8") );

    if (!this.db[name])
      this.db[name] = {};
      
    this.name = name;
    this.key = key;

    fs.writeFileSync("db.json", JSON.stringify(this.db));
  }

  connect = async () => {
    return this;
  }

  setEntity = async (entity) => {
    this.entity = entity;

    if (typeof this.db[this.name][this.entity] === "undefined")
      this.set([]);
  }

  count = async (query = {}) => {
    return this.db[this.name][this.entity]?.length || 0;
  }

  validateID = async (id) => {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
}
