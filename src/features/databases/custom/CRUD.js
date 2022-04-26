import { ObjectId } from "mongodb";

export default class CRUD {
  // List e Gets =============================================================
  list = async (query = {}, skip = 0) => {
    try {
      const records = this.storage.find(query);
      const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

      return records.slice(skip, limit);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  find = async (query) => {
    return this.storage.find(query);
  }

  findByID = async (id) => {
    try {
      const [ record ] = await this.storage.find({ id });

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

      this.storage.add(record);

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

        this.storage.add(record);
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
      const index = this.storage.indexOf(query);

      if (index < 0)
        return false;

      const records = this.storage.getAll();

      records[index] = {
        ...records[index],
        ...data
      }

      this.storage.set(records);

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
    const queryResults = this.storage.find(query).map(item => JSON.stringify(item));

    this.storage.set(
      this.storage.getAll().filter(record => !queryResults.includes(JSON.stringify(record)))
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
    const records = this.storage.find(query);
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }

  getOldest = async (query, skip = 0) => {
    const records = this.storage.find(query).reverse();
    const limit = CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT + skip;

    return records.slice(skip, limit);
  }
}
