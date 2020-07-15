import Table from "@/Components/Table/Table";

export function isResize(e) {
  return e.target.closest(Table.selectors.resizeEl);
}

export function isCell(e) {
  return e.target.dataset.col;
}

export function isMoveKeyCode(e) {
  const keys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  return keys.includes(e.key)
}

export function isEscKeyCode(e) {
  return e.key === "Escape"
}

export function shouldSwitchToTable(e) {
  return e.key === 'Enter'||e.key === 'Tab'
}
