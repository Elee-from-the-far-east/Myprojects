import Table from '@/Components/Table/Table';



export const resizeHandler = (e) => {
  const resizeEl = e.target.closest(Table.selectors.resizeEl);
  if (resizeEl) {
    e.preventDefault();
    const elementToRz = resizeEl.closest(Table.selectors.tableColumn);
    const startCoords = resizeEl.getBoundingClientRect();
    let newCoords;
    
    document.onmousemove = (e) => {
      e.preventDefault();
      if (resizeEl.className.includes("col")) {
        newCoords = startCoords.x - e.clientX;
        resizeEl.style = `right: ${ newCoords }px;`;
      } else {
        newCoords = startCoords.y - e.clientY;
        resizeEl.style = `bottom: ${ newCoords }px;`;
      }
    };
    
    document.onmouseup = () => {
      resizeEl.style = ``;
      if (
          resizeEl.className.includes("col") &&
          newCoords
      ) {
        elementToRz.style = `width: ${
            elementToRz.offsetWidth - newCoords
        }px`;
      } else if (
          !resizeEl.className.includes("col") &&
          newCoords
      ) {
        elementToRz.style = `height: ${
            elementToRz.offsetHeight - newCoords
        }px`;
      }
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
};

