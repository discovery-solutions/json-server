
global["json-server"]["event-listener"] = {
  listeners: {}
};

const listeners = global["json-server"]["event-listener"].listeners;

export default class EventListener {
  constructor(event) {
    this.event = event;

    return this;
  }

  set(callback) {
    return EventListener.setListener(this.event, callback);
  }

  remove(index) {
    return EventListener.removeListener(this.event, index);
  }

  static setListener(event, callback) {
    const index = listeners.push(callback);

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
