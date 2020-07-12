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
    return `<th class="table__column table__column--header">${name}</th>`;
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
            <td class="table__column table__column--info">${number}</td>
            ${this.createColumns()}
            </tr>`;
  }

  createRows(qnty) {
    let html = '';
    for (let i = 1; i <= qnty; i++) {
      html+=this.createRow(i);
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
