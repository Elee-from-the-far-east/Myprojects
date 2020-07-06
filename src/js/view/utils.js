export const DOMElements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  resultsList: document.querySelector(".results__list"),
  searchButtonsContainer: document.querySelector('.results__pages'),
  recipeContainer: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list'),
  likesContainer: document.querySelector('.likes__list'),
  menuHeart: document.querySelector('.likes__field')
  
};

export  const querySelector = {
  spinner:'.loader',
  highlightResult: '.results__link--active',
  shopDeleteBtn:'.shopping__delete',
  shoppingItem: '.shopping__item',
  likeBtn: '.recipe__love',
  
};

export const limitString = (string, limit) => {
  if (string.length <= limit) return string;
  const newString = [];
  string.split(" ").reduce((sum, subString) => {
    if (sum + subString.length <= limit) {
      newString.push(subString);
      return sum + subString.length + 1;
    }
  }, 0);
  return `${newString.join(" ")} ...`;
};

export const makeFirstLetterUp =(string) => {
const firstLetter = string.slice(0,1);
return string.replace(firstLetter, firstLetter.toUpperCase())
};

const formatNumber = function (number) {
  number = Math.abs(Number(number)).toFixed(2).split(".");
  if (number[0].length > 3)
    number[0] =
        number[0].slice(0, number[0].length - 3) +
        "," +
        number[0].slice(number[0].length - 3);
  return number[0] + "." + number[1];
};


export const renderLoadSpinner = (parentElement) => {
  const spinner = `<div class="loader">
                     <svg>
                       <use href="img/icons.svg#icon-cw"></use>
                     </svg>
                   </div>`;
  parentElement.insertAdjacentHTML("afterbegin", spinner);
};

export const deleteLoadSpinner = (spinnerSelector) => {
  document.querySelector(spinnerSelector).remove();
};
