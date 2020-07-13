import Table from '@/Components/Table/Table';



export const resizeHandler = (e, instance) => {
  const resizeEl = e.target.closest(Table.selectors.resizeEl);
  if (resizeEl) {
    e.preventDefault();
    const elementToRz = resizeEl.closest(Table.selectors.tableColumn);
    const startCoords = resizeEl.getBoundingClientRect();
    let resizeData = {
      resizeEl,
      elementToRz,
      startCoords,
    };

  
    const mouseMoveHandler = (e) => {
      e.preventDefault();
      if (resizeData.resizeEl.className.includes("col")) {
        resizeData.newCoords = resizeData.startCoords.x - e.clientX;
        resizeData.resizeEl.style = `right: ${resizeData.newCoords}px;`;
      } else {
        resizeData.newCoords = resizeData.startCoords.y - e.clientY;
        resizeData.resizeEl.style = `bottom: ${resizeData.newCoords}px;`;
      }
    };
  
    const mouseUpHandler = () => {
      if (resizeData) {
        resizeData.resizeEl.style = ``;
        if (
            resizeData.resizeEl.className.includes("col") &&
            resizeData.newCoords
        ) {
          resizeData.elementToRz.style = `width: ${
              resizeData.elementToRz.offsetWidth - resizeData.newCoords
          }px`;
        } else if (
            !resizeData.resizeEl.className.includes("col") &&
            resizeData.newCoords
        ) {
          resizeData.elementToRz.style = `height: ${
              resizeData.elementToRz.offsetHeight - resizeData.newCoords
          }px`;
        }
        resizeData = null;
        instance.componentElement.removeListener("mousemove", mouseMoveHandler);
        instance.componentElement.removeListener("mouseup", mouseUpHandler);
      }
    };
    instance.componentElement.addListener("mousemove", mouseMoveHandler);
    instance.componentElement.addListener("mouseup", mouseUpHandler);
  }
};


