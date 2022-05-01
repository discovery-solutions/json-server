import fs from "fs";

export default class LocalStorage {
  constructor(database) {
    this.name = database;
    this.db = this.readFile();
  }

  setEntity(entity) {
    this.entity = entity;
  }

  writeFile = data => fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
  readFile = () => JSON.parse( fs.readFileSync("db.json", "utf8") ) || {};

  getAll = () => {
    this.db = this.readFile();
    return this.db[this.name][this.entity];
  }

  setAll = data => {
    this.db = data;
    this.writeFile(data);
  }

  add = (record) => {
    if ( Array.isArray(this.db[this.name][this.entity]) === false )
      this.db[this.name][this.entity] = [];

    this.db[this.name][this.entity].push(record);

    this.writeFile(this.db);
  }

  set = (records) => {
    this.db[this.name][this.entity] = records;

    this.writeFile(this.db);
  }

  find = (query = {}) => {
    const data = this.getAll();
    const keys = Object.keys(query);
    const records = [];

    if (keys.length === 0)
      return data;

    for (const row of data) {
      const matchs = [];

      keys.forEach(key => {
        if (row[key] === query[key])
          matchs.push(true);
      });

      if (matchs.length === keys.length)
        records.push(row);
    }

    return records;
  }

  indexOf = (query = {}) => {
    const keys = Object.keys(query);
    let i = 0;

    for (const row of this.getAll()) {
      const matchs = [];

      keys.forEach(key => {
        if (row[key] === query[key])
          matchs.push(true);
      });

      if (matchs.length === keys.length)
        return i;

      i++;
    }

    return -1;
  }
}
