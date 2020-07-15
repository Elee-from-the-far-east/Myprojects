/* eslint-disable no-invalid-this */
import ExcelComponent from "@core/ExcelComponent";
import { resize } from "@/Components/Table/resize";
import { createTable } from "@/Components/Table/tableCreate";
import { Selection } from "@/Components/Table/Selection";
import {
  isCell,
  isEscKeyCode,
  isMoveKeyCode,
  isResize,
} from "@/Components/Table/conditionHelpers";
import * as actions from "@/Redux/actions";
import { getCellData } from "@/Redux/actions";

export default class Table extends ExcelComponent {
  static tagName = "section";
  static className = "excel__table";
  static selectors = {
    tableColumn: ".table__column",
    columnHeader: ".table__column--header",
    rowHeader: ".table__column--info",
    tableRow: ".table__row",
    resizeEl: ".table__resize-el",
    defaultCell: '[data-col="1"][data-row="1"]',
    selectedCell: "",
  };
  static classes = {
    selected: "table__column--selected",
  };
  static setDefaultTabListener() {
    document.onkeydown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        this.selection.select(
          this.rootElement.find(Table.selectors.defaultCell)
        );
      }
    };
  }

  constructor(rootElement, options) {
    super(rootElement, {
      name: "Table",
      listeners: ["mousedown", "keydown", "input"],
      ...options,
    });
  }

  init() {
    super.init();
    this.selection = new Selection();
    this.defaultCell = this.rootElement.find(Table.selectors.defaultCell);
    this.selection.select(this.defaultCell);
    this.restoreState();
    this.observer.trigger("on-cell-switch", this.defaultCell.textContent);
    this.observer.add("formula-input", (text)=>{
      this.setTextToCell(text);
      this.updateCellInfoInState(text)
    });
    this.observer.add("formula-enter-pressed", () => {
      this.selection.previous.focus();
    });
    Table.setDefaultTabListener.call(this);
  }

  restoreState() {
    const { columnState } = this.getState();
    const elements = this.rootElement.findAll(
      Table.selectors.columnHeader + "," + Table.selectors.rowHeader
    );
    elements.forEach((el) => {
      const key = Object.keys(columnState).find(
        (key) => key === el.textContent.trim()
      );
      if (key && !isNaN(+key)) el.style.height = columnState[key] + "px";
      else if (key) el.style.width = columnState[key] + "px";
    });
  }

  updateCellInfoInState(text) {
    this.dispatch(
      getCellData({
        row: this.selection.previous.dataset.row,
        col: this.selection.previous.dataset.col,
        value: text,
      })
    );
  }

  onMousedown(e) {
    if (isResize(e))
      resize(e).then((data) => this.dispatch(actions.tableResize(data)));
    else if (isCell(e)) {
      if (!e.shiftKey) this.selection.select(e.target);
      else {
        const cells = this.getSelectedCellsSelectors(e).map((selector) =>
          this.rootElement.find(selector)
        );
        this.selection.selectGroup(cells);
      }
    }
  }

  onKeydown(e) {
    if (isMoveKeyCode(e)) {
      e.preventDefault();
      document.onkeydown = null;
      const cell = this.rootElement.find(this.getNextCell(e));
      this.selection.select(cell);
      this.observer.trigger("on-cell-switch", cell.textContent);
    } else if (isEscKeyCode(e)) {
      this.selection.select(this.defaultCell);
      this.selection.clear();
      document.activeElement.blur();
      Table.setDefaultTabListener.call(this);
    }
  }

  onInput(e) {
    // if (isCell(e)) this.observer.trigger("on-cell-input", e.target.textContent);
    if (isCell(e)) this.updateCellInfoInState(e.target.textContent);
  }

  returnHTML() {
    return createTable(20);
  }

  setTextToCell(text) {
    this.selection.previous.textContent = text;
  }

  getCellInfo(element) {
    return {
      col: +element.dataset.col,
      row: +element.dataset.row,
    };
  }

  getCellsRange(start, end) {
    if (start > end) [end, start] = [start, end];
    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }

  getSelectedCellsSelectors(e) {
    const targetElInfo = this.getCellInfo(e.target);
    const previousElInfo = this.getCellInfo(this.selection.previous);
    const cols = this.getCellsRange(targetElInfo.col, previousElInfo.col);
    const rows = this.getCellsRange(targetElInfo.row, previousElInfo.row);
    return cols.reduce((acc, col) => {
      rows.forEach((row) => acc.push(`[data-col="${col}"][data-row="${row}"]`));
      return acc;
    }, []);
  }

  getNextCell(e) {
    const MIN_VALUE = 1;
    let { col, row } = this.getCellInfo(e.target);
    switch (e.key) {
      case "ArrowUp":
        row--;
        break;
      case "ArrowDown":
        row++;
        break;
      case "ArrowLeft":
        col--;
        break;
      case "ArrowRight":
      case "Tab":
        col++;
        break;
    }
    return `[data-col="${
      col > MIN_VALUE && true ? col : (col = MIN_VALUE)
    }"][data-row="${row > MIN_VALUE && true ? row : (row = MIN_VALUE)}"]`;
  }
}
