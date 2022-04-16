import * as Utils from "utilities/utils";

const METHODS = {
  CREATE: "post",
  UPDATE: "patch",
  DELETE: "delete",
  LIST: "get",
  GET: "get",
}

export default class Entity {
  constructor(request) {
    const { method, url } = request;
    const isValidURL = this.validateURL(url);
    const isValidMethod = Object.values(METHODS).includes(method.toLowerCase());

    this.request = request;
    this.response = null;

    if ( isValidMethod === false || isValidURL === false)
      return this.next(404);

    return this.action();
  }

  next(code) {
    return {
      response: this.response,
      code,
    }
  }

  validateURL(url) {
    const json = Utils.getJSON();

    for (const entity of json.entities) {
      const hasEntityName = url.search( entity.name ) > -1;

      if (hasEntityName)
        return true;
    }

    return false;
  }

  action() {
    this.response = {
      message: "DO ACTION"
    }

    return this.next(200);
  }
}
