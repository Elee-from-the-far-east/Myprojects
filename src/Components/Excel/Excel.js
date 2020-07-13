import DOMElement from "@core/DOMElement";
import Table from '@/Components/Table/Table';


export default class Excel {
  constructor(selector, { components }) {
    this.element = document.querySelector(selector);
    this.components = components || [];
  }

  getRootElement() {
    const root = new DOMElement("div", "excel");
    this.components = this.components.map((Component) => {
      const rootElement = new DOMElement(
        Component.tagName,
        Component.className
      );
      const component = new Component(rootElement);
      rootElement.setHTML(component.returnHTML());
      root.append(rootElement.get());
      return component;
    });
    return root.get();
  }

  render() {
    this.element.append(this.getRootElement());
    this.components.forEach((component) => component.addDOMListeners());
    this.components.find(el=>el.constructor===Table).init();
    
  }
}
