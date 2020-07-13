import DOMElement from "@core/DOMElement";

export default class Excel {
  constructor(selector, { components }) {
    this.$el = document.querySelector(selector);
    this.components = components || [];
  }

  getRootElement() {
    const rootElement = new DOMElement("div", "excel");
    this.components = this.components.map((Component) => {
      const componentElement = new DOMElement(
        Component.tagName,
        Component.className
      );
      const component = new Component(componentElement);
      componentElement.setHTML(component.returnHTML());
      rootElement.append(componentElement.get());
      return component;
    });
    return rootElement.get();
  }

  render() {
    this.$el.append(this.getRootElement());
    this.components.forEach((component) => component.addDOMListeners());
  }
}
