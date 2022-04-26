const requests = {};

export default class Requests {
  run = async (req, res) => {
    try {
      const requestsByMethod = requests[req.method];
      const statusLog = [];

      for (const key in requestsByMethod)
        if ( req.url.value.search(key) > -1 )
          for (const callback of requestsByMethod[key])
            statusLog.push(
              await Promise.resolve( callback(req, res) ).catch(console.log)
            );

      return statusLog.length > 0 && statusLog.includes(false) === false;
    } catch (e) {
      console.log(e);

      return false;
    }
  }

  register = (method, path, callback) => {
    if (typeof requests[method] === "undefined")
      requests[method] = {};

    if ( Array.isArray(requests[method][path]) === false )
      requests[method][path] = [];

    requests[method][path].push(callback);
  }

  // Alias registering callbacks
  use = (...args) => {
    return this.register(...args);
  }

  get = (...args) => {
    return this.register(CONSTANTS.SERVER.METHODS.GET, ...args);
  }

  post = (...args) => {
    return this.register(CONSTANTS.SERVER.METHODS.POST, ...args);
  }

  patch = (...args) => {
    return this.register(CONSTANTS.SERVER.METHODS.PATCH, ...args);
  }

  delete = (...args) => {
    return this.register(CONSTANTS.SERVER.METHODS.DELETE, ...args);
  }
}
