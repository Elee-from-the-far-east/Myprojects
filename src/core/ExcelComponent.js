import DOMListeners from "@core/DOMListeners";

export default class ExcelComponent extends DOMListeners {
  constructor($el, { listeners, name } = {}) {
    super($el, listeners);
    this.name = name;
  }

  returnHTML() {
    return ``;
  }
}
