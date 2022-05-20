import { Entities } from "utilities/constants";
import Databases from "features/databases";
import * as Utils from "utilities/utils";
import jwt from "jsonwebtoken";
import crypto from "crypto";

let DEFAULT_ENTITY, DB;

export default class AuthTokenHandler {
  constructor({ entity, server }) {
    DEFAULT_ENTITY = CONSTANTS.SERVER.SETTINGS.DATABASE.AUTH;
    DB = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT;

    this.server = server;

    try {
      this.database = Databases.get(server?.database || DB);
      this.database.setEntity(DEFAULT_ENTITY);
    } catch (e) {
      logger(e);
    }
  }

  async validate(originalToken) {
    try {
      const token = originalToken?.toLowerCase().search("bearer") > -1 ? originalToken.replace( new RegExp("bearer ", "gi"), "" ) : originalToken;

      await this.database.setEntity(DEFAULT_ENTITY);

      const auth = await this.database.find({ token });

      if (!auth?.entity)
        return [false, false];

      if (this.isValidTokenTimeout(auth) === false)
        return [ "expired", false ]

      switch (auth.entity.type) {
        // ADMIN CASE
        case Entities.ADMIN.name: {
          const { data } = jwt.verify(auth.token, Entities.ADMIN.auth.secret);

          return [
            Utils.secureEntity(data, Entities.ADMIN),
            Entities.ADMIN.name,
          ];
        }
        // DEFAULT CASE
        default: {
          const entityDB = Databases.get(this.server?.database || DB);
          await entityDB.setEntity(auth.entity.type);

          const entity = await entityDB.findByID(auth.entity.id);

          await this.database.setEntity(DEFAULT_ENTITY);

          const entityModel = Utils.getJSON().entities.find(e => e.name === auth.entity.type);

          return [
            Utils.secureEntity(entity, entityModel),
            auth.entity.type,
          ];
        }
      }
    } catch (e) {
      logger(e);

      return [false, false];
    }
  }

  async register(id, type, token) {
    try {
      await this.database.setEntity(DEFAULT_ENTITY);

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

  isValidTokenTimeout(auth) {
    const diff = Math.abs(new Date() - auth.created);
    const hours = diff / (1000 * 60 * 60);

    if (hours < 48)
      return true;

    return false;
  }

  generate() {
    return crypto.randomBytes(64).toString("hex");
  }
}
