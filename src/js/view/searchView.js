import { DOMElements, limitString, querySelector } from "./utils";

export const getInput = () => DOMElements.searchInput.value;
export const clearInput = () => (DOMElements.searchInput.value = "");
export const clearResultsList = () => (DOMElements.resultsList.innerHTML = "");

const createRecipeElement = (searchResult, index, start, clickHandler) => {
  const markup = ` <li>
                    <a class="results__link" href="#${index + start}">
                        <figure class="results__fig">
                            <img src=${searchResult.recipe.image} alt=${
    searchResult.recipe.label
  }>
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitString(
                              searchResult.recipe.label,
                              17
                            )}</h4>
                            <p class="results__author">${
                              searchResult.recipe.source
                            }</p>
                        </div>
                    </a>
                </li>`;
  DOMElements.resultsList.insertAdjacentHTML("beforeend", markup);
  DOMElements.resultsList.lastElementChild.addEventListener("click",clickHandler.bind(null,index+start));
};

export const renderRecipeElements = (
  searchResults,
  clickHandler,
  page = 1,
  quantity = 10
) => {
  const start = (page - 1) * quantity;
  const end = start + quantity;
  const pages = Math.ceil(searchResults.length / quantity);
  if (page <= pages) {
    searchResults.slice(start, end).forEach((el, i) => {
      createRecipeElement(el, i, start, clickHandler);
    });
    renderButtons(pages, page);
  }
};

export const renderButtons = (maxPages, page) => {
  if (page === 1) createButton(page, "next");
  else if (page === maxPages) createButton(page, "prev");
  else {
    createButton(page, "next");
    createButton(page, "prev");
  }
};

const createButton = (page, type) => {
  const markup = `<button class="btn-inline results__btn--${type}">
                    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${
                          type === "prev" ? "left" : "right"
                        }"></use>
                    </svg>
                </button>`;
  DOMElements.searchButtonsContainer.insertAdjacentHTML("afterbegin", markup);
};

export const highlightSelected = (id,isSearch) => {
  if(isSearch) {
    const element = DOMElements.resultsList.querySelector(
        querySelector.highlightResult);
    element ? element.classList.remove(
        querySelector.highlightResult.split('.')[1]) : '';
    DOMElements.resultsList.querySelector(`a[href="#${ id }"]`).
        classList.
        add(querySelector.highlightResult.split('.')[1])
  }
};

export const deleteButtons = () => {
  DOMElements.searchButtonsContainer.innerHTML = "";
};
