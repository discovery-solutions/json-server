const requests = {};

const defaultOptions = {
  public: true,
}

export default class Requests {
  static getRequests() {
    const list = [];

    for (const method in requests)
      for (const path in requests[method])
        list.push({
          options: requests[method][path][0].options,
          method: method,
          path: path,
        });

    return list;
  }

  static inWhitelist(req) {
    return !!Requests.getRequests().find(item => {
      return (
        item.path === req.url.base &&
        item.method === req.method &&
        item.options.public !== false
      )
    });
  }

  run = async (req, res) => {
    try {
      const requestsByMethod = requests[req.method];
      const statusLog = [];
      const url = req.url.base === 0 ? "/" : req.url.base;

      for (const key in requestsByMethod)
        if ( url === key )
          for (const { callback } of requestsByMethod[key])
            statusLog.push(
              await Promise.resolve( callback(req, res) ).catch(logger)
            );

      return statusLog.length > 0 && statusLog.includes(false) === false;
    } catch (e) {
      logger(e);

      return false;
    }
  }

  getArgs = args => {
    const [ method, path ] = args;
    const options = typeof args[2] === "object" ? args[2] : defaultOptions;
    const callback = typeof args[3] === "function" ? args[3] : args[2];

    return { method, path, options, callback };
  }

  register = (...args) => {
    const { method, path, options, callback } = this.getArgs(args);

    if (typeof requests[method] === "undefined")
      requests[method] = {};

    if ( Array.isArray(requests[method][path]) === false )
      requests[method][path] = [];

    requests[method][path].push({ options, callback });
  }

  // Alias registering callbacks
  use = (...args) => this.register(...args);

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
