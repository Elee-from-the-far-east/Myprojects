import { DOMElements, limitString, querySelector } from "./utils";

export const highlightHeart = () => {
  const heartBtn = DOMElements.recipeContainer.querySelector(
    querySelector.likeBtn + " use"
  );
  const href = heartBtn.href.baseVal.includes(`outlined`)
    ? "icon-heart"
    : "icon-heart-outlined";
  heartBtn.setAttribute("href", `img/icons.svg#${href}`);
};

export const highlightMenuHeart = (isLikes) => {
  DOMElements.menuHeart.style.visibility = isLikes ? "visible" : "hidden";
};

export const createRecipeElement = ({recipeId, recipe}, clickHandler) => {
  const markup = ` <li>
                            <a class="likes__link" href="#${recipeId}">
                                <figure class="likes__fig">
                                    <img src="${recipe.image}" alt="Test">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${recipe.label}</h4>
                                    <p class="likes__author">${recipe.source}</p>
                                </div>
                            </a>
                        </li>`;
  DOMElements.likesContainer.insertAdjacentHTML("beforeend", markup);
  DOMElements.likesContainer.lastElementChild.addEventListener(
    "click",
    clickHandler.bind(null, recipeId)
  );
};

export const deleteElement = (id) => {
  DOMElements.likesContainer.querySelector(`a[href="#${id}"]`).parentElement.remove();
};
