export default class Observer {
  constructor() {
    this.events = {};
  }

  add(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
    return () => {
          this.events[event] = this.events[event].filter(el=>el!==callback)
    };
  }

  trigger(event, ...args) {
    this.events[event].forEach((callback) => callback(...args));
  }
}


