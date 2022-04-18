import * as Utils from "utilities/utils";
import Databases from "features/databases";

class EntityHandler {
  constructor(request, database) {
    this.request = request;
    this.response = null;
    this.entity = {};
    this.database = Databases.get(database);

    this.url = {
      value: request.url,
      splited: request.url.split("/").filter(item => item.length > 0),
    }
  }

  async run() {
    const { method, url } = this.request;
    const isValidURLCode = await this.validateURL(url);
    const isValidMethod = Object.values(CONSTANTS.SERVER.METHODS).includes(method);

    if ( isValidMethod === false )
      return this.next(404);

    if ( isValidURLCode !== 200 )
      return this.next(isValidURLCode);

    return await this.action();
  }

  next = (code) => ({
    response: this.response,
    code,
  })

  validateURL = async (url) => {
    try {
      const json = Utils.getJSON();
      const [ urlEntity ] = this.url.splited;

      for (const entity of json.entities) {
        const hasEntityName = (urlEntity === entity.name);

        if (hasEntityName) {
          this.entity = entity;
          await this.database.setEntity( entity.name );
          return 200;
        }
      }

      return 404;
    } catch (e) {
      return 500;
    }
  }

  validateMethod = (key) => {
    return this.request.method === CONSTANTS.SERVER.METHODS[key];
  }

  action = async () => {
    const isList = this.validateMethod("LIST") && this.url.splited.length === 1;
    const isGet = this.validateMethod("GET") && this.url.splited.length === 2;

    if (isList)
      return await this.list();

    if (isGet)
      return await this.get();

    return this.next(404);
  }

  // CRUD Methods For Controller
  list = async () => {
    try {
      const [ records, count ] = await Promise.all([
        this.database.list(),
        this.database.count(),
      ]);

      this.response = {
        records: records,
        count: count,
      }

      return this.next(200);
    } catch (e) {
      // console.log(e);
      return this.next(500);
    }
  }

  get = async () => {
    try {
      const id = parseInt( this.url.splited[1] );

      if (Number.isNaN(id))
        return this.next(404);

      const entity = await this.database.findByID(id);

      console.log(entity);

      if (entity === false)
        return this.next(204);

      this.response = {
        [this.entity.name]: entity
      }

      return this.next(200);
    } catch (e) {
      // console.log(e);
      return this.next(500);
    }
  }
}

export default class Entity {
  static handle(request, database) {
    const entity = new EntityHandler(request, database);

    return entity.run();
  }
}
