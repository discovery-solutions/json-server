import { ObjectId } from "mongodb";
import fs from "fs";

export default class CRUD {
  getAll = () => {
    this.db = JSON.parse( fs.readFileSync("db.json", "utf8") );

    return this.db[this.name][this.entity];
  }

  add = (record) => {
    this.db[this.name][this.entity].push(record);

    fs.writeFileSync("db.json", JSON.stringify(this.db));
  }

  set = (records) => {
    this.db[this.name][this.entity] = records;

    fs.writeFileSync("db.json", JSON.stringify(this.db));
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

  // List e Gets =============================================================
  list = async (query = {}, skip = 0) => {
    try {
      const records = this.find(query);
      const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

      return records.slice(skip, limit);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  findAll = async (query) => {
    return this.find(query);
  }

  findByID = async (id) => {
    try {
      const [ record ] = await this.find({ id });

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

      this.add(record);

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

        this.add(record);
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

      const records = this.getAll();

      records[index] = {
        ...records[index],
        ...data
      }

      this.set(records);

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
    const queryResults = this.find(query).map(item => JSON.stringify(item));

    this.set(
      this.getAll().filter(record => !queryResults.includes(JSON.stringify(record)))
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
    const records = this.find(query);
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }

  getOldest = async (query, skip = 0) => {
    const records = this.find(query).reverse();
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }
}
