import Table from '@/Components/Table/Table';

export class Selection {
  constructor() {
    this.selected = [];
    this.previous = null;
  }

  select(element) {
    this.clear();
    this.selected.push(element);
    this.previous = element;
    element.focus();
    element.classList.add(Table.classes.selected);
    
  }
  
  clear(){
    this.selected.forEach(el=>el.classList.remove(Table.classes.selected));
    this.selected = [];
  }
  
  
 
  selectGroup(elements) {
    this.clear();
    this.selected=elements;
    this.selected.forEach(el=>el.classList.add(Table.classes.selected));
  }
  
}
