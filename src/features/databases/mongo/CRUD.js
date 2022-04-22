import { ObjectId } from "mongodb";

export default class CRUD {
  constructor() {
    this.entity = null;
    this.collection = {};
  }

  // List e Gets =============================================================
  async list(query = {}, skip = 0) {
    try {
      return await this.collection.find(query)
                  .limit(CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT)
                  .skip(skip)
                  .sort({ updated: -1 })
                  .toArray();
    } catch (e) {
      return false;
    }
  }

  async find(data) {
    return await this.collection.findOne(data);
  }

  async findByID(id) {
    try {
      const res = await this.find({ _id: ObjectId(id) });

      return res;
    } catch (e) {
      return false;
    }
  }

  // Insert ==================================================================
  async insert(data) {
    try {
      const date = new Date();

      const res = await this.collection.insertOne({
        updated: date,
        created: date,
        ...data,
      });

      return await this.findByID(res.insertedId);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async insertMany(data) {
    try {
      const date = new Date();

      const items = data.map(item => ({
          ...item,
          updated: date,
          created: date
      }));

      const res = await this.collection.insertMany(items);

      return res.ops;
    } catch (e) {
      return false;
    }
  }

  // Update ==================================================================
  async updateByID(id, data) {
    return await this.update({ _id: ObjectId(id) }, data);
  }

  async update(query, data) {
    return await this.collection.updateOne(query, {
      $set: {
        updated: new Date(),
        ...data,
      }
    });
  }

  async updateMany(query, data) {
    return await this.collection.updateMany(query, {
      $set: {
        updated: new Date(),
        ...data,
      }
    });
  }

  // Delete ==================================================================
  async delete(query) {
      return await this.collection.deleteOne(query);
  }

  async deleteByID(id) {
      return await this.delete({ _id: ObjectId(id) });
  }

  async deleteMany(query) {
      return await this.collection.deleteMany(query);
  }

  // Featured ================================================================
  async getLatest(query) {
    return await this.collection.find(query)
                .limit(CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT)
                .sort({ $natural: -1 })
                .toArray();
  }

  async getOldest(query) {
    return await this.collection.find(query)
                .limit(CONSTANTS.SERVER.SETTINGS.REQUEST.LIMIT)
                .sort({ $natural: 1 })
                .toArray();
  }
}
