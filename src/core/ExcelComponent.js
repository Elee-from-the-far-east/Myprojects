import DOMListeners from "@core/DOMListeners";

export default class ExcelComponent extends DOMListeners {
  constructor(rootElement, { listeners, name, observer } = {}) {
    super(rootElement, listeners);
    this.name = name;
    this.observer = observer;
  }

  returnHTML() {
    return ``;
  }
}
