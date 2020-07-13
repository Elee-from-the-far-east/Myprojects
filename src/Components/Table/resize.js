import Table from '@/Components/Table/Table';

let MoveHandler;
let UpHandler;
export const resizeHandler = (e, instance) => {
  const resizeEl = e.target.closest(Table.selectors.resizeEl);
  if (resizeEl) {
    e.preventDefault();
    const elementToRz = resizeEl.closest(Table.selectors.tableColumn);
    const startCoords = resizeEl.getBoundingClientRect();
    instance.resize = {
      resizeEl,
      elementToRz,
      startCoords,
    };
    MoveHandler = mouseMoveHandler.bind(null,instance);
    UpHandler = mouseUpHandler.bind(null,instance);
    instance.componentElement.addListener("mousemove", MoveHandler);
    instance.componentElement.addListener("mouseup", UpHandler);
  }
};

const mouseMoveHandler = (instance,e) => {
  e.preventDefault();
  if (instance.resize.resizeEl.className.includes("col")) {
    instance.resize.newCoords = instance.resize.startCoords.x - e.clientX;
    instance.resize.resizeEl.style = `right: ${instance.resize.newCoords}px;`;
  } else {
    instance.resize.newCoords = instance.resize.startCoords.y - e.clientY;
    instance.resize.resizeEl.style = `bottom: ${instance.resize.newCoords}px;`;
  }
};

const mouseUpHandler = (instance) => {
  if (instance.resize) {
    instance.resize.resizeEl.style = ``;
    if (
      instance.resize.resizeEl.className.includes("col") &&
      instance.resize.newCoords
    ) {
      instance.resize.elementToRz.style = `width: ${
        instance.resize.elementToRz.offsetWidth - instance.resize.newCoords
      }px`;
    } else if (
      !instance.resize.resizeEl.className.includes("col") &&
      instance.resize.newCoords
    ) {
      instance.resize.elementToRz.style = `height: ${
        instance.resize.elementToRz.offsetHeight - instance.resize.newCoords
      }px`;
    }
    instance.resize = null;
    instance.componentElement.removeListener("mousemove", MoveHandler);
    instance.componentElement.removeListener("mouseup", UpHandler);
  }
};
