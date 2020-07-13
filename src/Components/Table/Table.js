/* eslint-disable no-invalid-this */
import ExcelComponent from "@core/ExcelComponent";
import {
  mouseDownHandler,
  mouseMoveHandler,
  mouseUpHandler,
} from "@/Components/Table/resize";
import { createTable } from "@/Components/Table/tableCreate";

export default class Table extends ExcelComponent {
  static tagName = "section";
  static className = "excel__table";

  constructor(componentElement) {
    super(componentElement, {
      name: "Table",
      listeners: ["mousedown"],
    });
  }

  onMousedown(e) {
    mouseDownHandler(e, this);
  }

  onMousemove(e) {
    mouseMoveHandler(e, this);
  }

  onMouseup() {
    mouseUpHandler(this);
  }

  returnHTML() {
    return createTable(20);
  }
}
