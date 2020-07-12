import { makeFirstLetterUp } from "@core/utils";

export default class DOMListeners {
  constructor(componentElement, listeners = []) {
    if (!componentElement) {
      throw new Error(`No element for DOMListener was provided`);
    }
    this.componentElement = componentElement;
    this.listeners = listeners;
  }
  addDOMListeners() {
    this.listeners.forEach((listener) => {
      const callbackName = getCBName(listener);
      if (!this[callbackName])
        throw new Error(
          `there is no ${callbackName} callback for the ${listener} listener, component: ${this['name']}`
        );
      this[callbackName] = this[callbackName].bind(this);
      this.componentElement.addListener(listener, this[callbackName]);
    });
  }

  removeDOMListeners() {
    this.listeners.forEach((listener) => {
      const callbackName = getCBName(listener);
      this.componentElement.removeListener(listener, this[callbackName]);
    });
  }
}

function getCBName(listener) {
    return "on" + makeFirstLetterUp(listener)
}
