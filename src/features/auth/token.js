import Databases from "features/databases";
import crypto from "crypto";

let DEFAULT_ENTITY;

export default class AuthTokenHandler {
  constructor({ entity, server }) {
    DEFAULT_ENTITY = CONSTANTS.SERVER.SETTINGS.DATABASE.AUTH;

    this.database = Databases.get(server?.database);
    this.database.setEntity(DEFAULT_ENTITY);
  }

  async validate(token) {
    try {
      const records = await this.database.find({ token });

      if (records.length === 0)
        return false;

      const [ record ] = records;

      await this.database.setEntity(record.entity.type);

      const entity = await this.database.findByID(record.entity.id);

      this.database.setEntity(DEFAULT_ENTITY);
      return entity;
    } catch (e) {
      logger(e);

      this.database.setEntity(DEFAULT_ENTITY);
      return false;
    }
  }

  async register(id, type, token) {
    try {
      const status = await this.database.insert({
        token: token,
        entity: { type, id }
      });

      return true;
    } catch (e) {
      logger(e);

      return false;
    }
  }

  generate() {
    return crypto.randomBytes(64).toString("hex");
  }
}
