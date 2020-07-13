import DOMListeners from "@core/DOMListeners";

export default class ExcelComponent extends DOMListeners {
  constructor(rootElement, { listeners, name } = {}) {
    super(rootElement, listeners);
    this.name = name;
  }

  returnHTML() {
    return ``;
  }
}
