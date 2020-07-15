export const makeFirstLetterUp = (string) => {
  const firstLetter = string.slice(0, 1);
  return string.replace(firstLetter, firstLetter.toUpperCase());
};

export function storage(key, data) {
  if (data) localStorage.setItem(key, JSON.stringify(data));
  else return JSON.parse(localStorage.getItem(key));
}

export function isEqual(a, b) {
  if (typeof a === "object" && typeof b === "object") {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return a === b;
}
export function deepClone(obj) {
  const clObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Object) {
      clObj[key] = deepClone(obj[key]);
    } else {
      clObj[key] = obj[key];
    }
  });
  return clObj;
}
