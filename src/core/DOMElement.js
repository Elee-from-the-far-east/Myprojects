export default class DOMElement {
    element;

    constructor(tagName, classNames = "") {
        this.element = document.createElement(tagName);
        this.element.className = classNames;
    }

    setHTML(html, where = "beforeend") {
        this.element.insertAdjacentHTML(where, html);
    }

    clearHTML() {
        this.element.innerHTML = "";
    }

    get() {
        return this.element;
    }

    append(node) {
        this.element.appendChild(node);
    }

    appendTo(node) {
        node.appendChild(this.element);
    }

    find(selector) {
        return this.element.querySelector(selector)
    }

    findAll(selector) {
        return this.element.querySelectorAll(selector)
    }

    addListener(type, callback) {
        this.element.addEventListener(type, callback);
    }

    removeListener(type, callback) {
        this.element.removeEventListener(type, callback);
    }

    css(styles = []) {
        this.element.style = styles.join(";");
    }
}
