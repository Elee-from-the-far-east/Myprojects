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
    element.classList.add(Table.classes.selected);
    
  }
  
  clear(){
    this.selected.forEach(el=>el.classList.remove(Table.classes.selected));
    this.selected = [];
  }
  
 
  selectgroup(selectors, root) {
    this.clear();
    this.selected=selectors.map(selector=>root.find(selector));
    this.selected.forEach(el=>el.classList.add(Table.classes.selected));
   
  }
}
