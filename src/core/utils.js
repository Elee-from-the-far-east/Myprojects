export const makeFirstLetterUp = (string) => {
  const firstLetter = string.slice(0, 1);
  return string.replace(firstLetter, firstLetter.toUpperCase());
};
