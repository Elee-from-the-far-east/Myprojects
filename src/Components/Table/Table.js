/* eslint-disable no-invalid-this */
import ExcelComponent from "@core/ExcelComponent";

export default class Table extends ExcelComponent {
  static tagName = "section";
  static className = "excel__table";
  CHAR__CODES = {
    A: 65,
    Z: 90,
  };
  columnQnty = this.CHAR__CODES.Z - this.CHAR__CODES.A;
  columnNames = this.createColName();

  constructor(componentElement) {
    super(componentElement, {
      name: "Table",
      listeners: ["mousedown"],
    });
  }

  onMousedown(e) {
    const resizeEl = e.target.closest(".table__resize-el");
    let startCoords;
    if (resizeEl) {
      e.preventDefault();
      const elementToRz = resizeEl.closest(".table__column");
      if (resizeEl.className.includes("col")) {
        startCoords =
          e.clientX - (e.clientX - resizeEl.getBoundingClientRect().x);
      } else {
        startCoords =
          e.clientY - (e.clientY - resizeEl.getBoundingClientRect().y);
      }
      this.resize = {
        resizeEl,
        elementToRz,
        startCoords,
      };
      this.onMousemove = this.onMousemove.bind(this);
      this.onMouseup = this.onMouseup.bind(this);
      this.componentElement.addListener("mousemove", this.onMousemove);
      this.componentElement.addListener("mouseup", this.onMouseup);
    }
  }

  onMousemove(e) {
    e.preventDefault();
    if (this.resize.resizeEl.className.includes("col")) {
      this.resize.newCoords = this.resize.startCoords - e.clientX;
      this.resize.resizeEl.style = `right: ${this.resize.newCoords}px;`;
    } else {
      this.resize.newCoords = this.resize.startCoords - e.clientY;
      this.resize.resizeEl.style = `bottom: ${this.resize.newCoords}px;`;
    }
  }

  onMouseup() {
    if (this.resize) {
      this.resize.resizeEl.style = ``;
      if (this.resize.resizeEl.className.includes('col')) {
        this.resize.elementToRz.style = `width: ${
          this.resize.elementToRz.offsetWidth - this.resize.newCoords
        }px`;
      } else {
        this.resize.elementToRz.style = `height: ${
          this.resize.elementToRz.offsetHeight - this.resize.newCoords
        }px`;
      }
      this.resize = null;
      this.componentElement.removeListener("mousemove", this.onMousemove);
      this.componentElement.removeListener("mouseup", this.onMouseup);
    }
  }

  returnHTML() {
    return `<table class="table">
              <tr class="table__row">
                <th class="table__column table__column--header"></th>
                ${this.createHeaders()}
              </tr>
              ${this.createRows(20)}
            </table>`;
  }

  createHeader(name) {
    return `<th class="table__column table__column--header">${name}
                <div class="table__resize-el table__resize-el--col"></div></th>`;
  }

  createHeaders() {
    const headers = this.columnNames.map(this.createHeader);
    return headers.join("");
  }

  createColumn() {
    return `<td class="table__column" contenteditable></td>`;
  }

  createColumns() {
    const cols = this.columnNames.map(this.createColumn);
    return cols.join("");
  }

  createRow(number) {
    return `<tr class="table__row">
            <td class="table__column table__column--info">${number}
            <div class="table__resize-el table__resize-el--row"></div></td>
            ${this.createColumns()}
            </tr>`;
  }

  createRows(qnty) {
    let html = "";
    for (let i = 1; i <= qnty; i++) {
      html += this.createRow(i);
    }
    return html;
  }

  createColName() {
    const colNames = [];
    for (let i = 0; i <= this.columnQnty; i++) {
      colNames.push(String.fromCharCode(this.CHAR__CODES.A + i));
    }
    return colNames;
  }
}
