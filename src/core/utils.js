export const makeFirstLetterUp = (string) => {
  const firstLetter = string.slice(0, 1);
  return string.replace(firstLetter, firstLetter.toUpperCase());
};

export function storage(key, data) {
  if(data)localStorage.setItem(key,JSON.stringify(data));
  else return JSON.parse(localStorage.getItem(key))
}

