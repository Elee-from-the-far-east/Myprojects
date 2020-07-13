export const mouseDownHandler = (e, Table) => {
  const resizeEl = e.target.closest(".table__resize-el");
  if (resizeEl) {
    e.preventDefault();
    const elementToRz = resizeEl.closest(".table__column");
    const startCoords = resizeEl.getBoundingClientRect();
    Table.resize = {
      resizeEl,
      elementToRz,
      startCoords,
    };
    Table.onMousemove = Table.onMousemove.bind(Table);
    Table.onMouseup = Table.onMouseup.bind(Table);
    Table.componentElement.addListener("mousemove", Table.onMousemove);
    Table.componentElement.addListener("mouseup", Table.onMouseup);
  }
};

export const mouseMoveHandler = (e, Table) => {
  e.preventDefault();
  if (Table.resize.resizeEl.className.includes("col")) {
    Table.resize.newCoords = Table.resize.startCoords.x - e.clientX;
    Table.resize.resizeEl.style = `right: ${Table.resize.newCoords}px;`;
  } else {
    Table.resize.newCoords = Table.resize.startCoords.y - e.clientY;
    Table.resize.resizeEl.style = `bottom: ${Table.resize.newCoords}px;`;
  }
};

export const mouseUpHandler = (Table) => {
  if (Table.resize) {
    Table.resize.resizeEl.style = ``;
    if (
      Table.resize.resizeEl.className.includes("col") &&
      Table.resize.newCoords
    ) {
      Table.resize.elementToRz.style = `width: ${
        Table.resize.elementToRz.offsetWidth - Table.resize.newCoords
      }px`;
    } else if (
      !Table.resize.resizeEl.className.includes("col") &&
      Table.resize.newCoords
    ) {
      Table.resize.elementToRz.style = `height: ${
        Table.resize.elementToRz.offsetHeight - Table.resize.newCoords
      }px`;
    }
    Table.resize = null;
    Table.componentElement.removeListener("mousemove", Table.onMousemove);
    Table.componentElement.removeListener("mouseup", Table.onMouseup);
  }
};
