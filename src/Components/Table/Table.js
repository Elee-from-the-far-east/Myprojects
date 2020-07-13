/* eslint-disable no-invalid-this */
import ExcelComponent from "@core/ExcelComponent";
import {
  resize,
} from "@/Components/Table/resize";
import { createTable } from "@/Components/Table/tableCreate";
import {Selection} from '@/Components/Table/Selection';
import {isCell, isResize} from '@/Components/Table/conditionHelpers';

export default class Table extends ExcelComponent {
  static tagName = "section";
  static className = "excel__table";
  static selectors = {
    tableColumn: '.table__column',
    tableRow: '.table__row',
    resizeEl: '.table__resize-el',
    defaultCell: '[data-col="1"][data-row="1"]',
    selectedCell: ''
  };
  static classes = {
    selected: 'table__column--selected',
  };
  
  constructor(rootElement) {
    super(rootElement, {
      name: "Table",
      listeners: ["mousedown"],
    });
  }
  
  init() {
    this.selection = new Selection();
    this.selection.select(
        this.rootElement.find(Table.selectors.defaultCell))
    
  }
  
  onMousedown(e) {
    if (isResize(e)) resize(e);
    else if (isCell(e)) {
      if (!e.shiftKey) this.selection.select(e.target);
      else this.selection.selectgroup(this.getSelectedCells(e), this.rootElement)
    }
  }
  
  returnHTML() {
    return createTable(20);
  }
  
  getCellInfo(element) {
    return {
      col: element.dataset.col,
      row: element.dataset.row
    }
  }
  getCellsRange(start,end){
    if(start>end)[end,start]=[start,end];
    const arr=[];
    for (let i = start; i <= end; i++) {
      arr.push(i)
    }
    return arr;
  }
  
  getSelectedCells(e){
    const targetElInfo = this.getCellInfo(e.target);
    const previousElInfo = this.getCellInfo(this.selection.previous);
    const cols = this.getCellsRange(targetElInfo.col, previousElInfo.col);
    const rows = this.getCellsRange(targetElInfo.row, previousElInfo.row);
    return cols.reduce((acc,col) => {
      rows.forEach(row=>acc.push(`[data-col="${col}"][data-row="${row}"]`));
      return acc
    },[])
  }
}
