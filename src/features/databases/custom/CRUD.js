import { ObjectId } from "mongodb";
import fs from "fs";

export default class CRUD {
  _getAll = () => {
    this.db = JSON.parse( fs.readFileSync("db.json", "utf8") );

    return this.db[this.name][this.entity];
  }

  _add = (record) => {
    this.db[this.name][this.entity].push(record);

    fs.writeFileSync("db.json", JSON.stringify(this.db));
  }

  _set = (records) => {
    this.db[this.name][this.entity] = records;

    fs.writeFileSync("db.json", JSON.stringify(this.db));
  }

  _find = (query = {}) => {
    const data = this._getAll();
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

    for (const row of this._getAll()) {
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

  // List e Gets =============================================================
  list = async (query = {}, skip = 0) => {
    try {
      const records = this._find(query);
      const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

      return records.slice(skip, limit);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  find = async (query) => {
    return this._find(query);
  }

  findByID = async (id) => {
    try {
      const [ record ] = await this._find({ id });

      if (record)
        return record;

      return false;
    } catch (e) {
      return false;
    }
  }

  // Insert ==================================================================
  insert = async (data) => {
    try {
      const date = new Date();
      const record = {
        updated: date,
        created: date,
        id: ObjectId(),
        ...data,
      };

      this._add(record);

      return record;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  insertMany = async (data) => {
    try {
      const date = new Date();
      const records = [];

      for (const item of data) {
        const record = {
          updated: date,
          created: date,
          id: ObjectId(),
          ...item,
        };

        this._add(record);
        records.push(record);
      }

      return records;
    } catch (e) {
      return false;
    }
  }

  // Update ==================================================================
  update = async (query, data) => {
    try {
      const index = this.indexOf(query);

      if (index < 0)
        return false;

      const records = this._getAll();

      records[index] = {
        ...records[index],
        ...data
      }

      this._set(records);

      return { modifiedCount: 1 }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  updateByID = async (id, data) => {
    try {
      const record = await this.update({ id }, data);

      return record;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  updateMany = async (query, data) => {
    return false;
  }

  // Delete ==================================================================
  delete = async (query) => {
    const queryResults = this._find(query).map(item => JSON.stringify(item));

    this._set(
      this._getAll().filter(record => !queryResults.includes(JSON.stringify(record)))
    );

    return {
      deletedCount: queryResults.length
    }
  }

  deleteByID = async (id) => {
    return await this.delete({ id });
  }

  deleteMany = async (query) => {
    return false;
  }

  // Featured ================================================================
  getLatest = async (query, skip = 0) => {
    const records = this._find(query);
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }

  getOldest = async (query, skip = 0) => {
    const records = this._find(query).reverse();
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }
}
