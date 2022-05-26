const listeners = {};

export default class EventListener {
  constructor(event) {
    this.event = event;

    if ( Array.isArray(listeners[event]) === false )
      listeners[event] = [];

    return this;
  }

  set(...args) {
    return EventListener.setListener(this.event, ...args);
  }

  remove(...args) {
    return EventListener.removeListener(this.event, ...args);
  }

  run = async (...args) => {
    const events = listeners[this.event].sort(item => item.options.priority ? -1 : 1);

    if ( Array.isArray(events) === false )
      return false;

    for (const { callback } of events) {
      try {
        await Promise.resolve( callback(...args) );
      } catch (e) {
        logger(e);
        return false;
      }
    }

    return true;
  }

  static setListener(event, ...args) {
    let options = args[0];
    let callback = args[1];

    if (args[1] === undefined) {
      callback = args[0];
      options = { priority: false };
    }

    const index = listeners[event].push({ options, callback});

    return index - 1;
  }

  static removeListener(event, index) {
    try {
      const updated = listeners[event].filter((item, position) => index !== position);

      return true;
    } catch (e) {
      return false;
    }
  }
}

export { Events } from "./events";
