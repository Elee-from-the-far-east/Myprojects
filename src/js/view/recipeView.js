import {DOMElements} from './utils';

const createRecipeItem = (ingredient) =>
  `  <li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count">${ingredient.count}</div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit">${ingredient.unit}</span>
                            ${ingredient.text}
                        </div>
                    </li>`;
  

export const renderRecipe = (recipe,ingredients) => {
const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.label}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.label}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        ${recipe.totalTime?'<use href="img/icons.svg#icon-stopwatch"></use>':''}
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.totalTime?recipe.totalTime:''}</span>
                    <span class="recipe__info-text"> ${recipe.totalTime?'minutes':''}</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.yield}</span>
                    <span class="recipe__info-text"> servings</span>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>
            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                   ${ingredients.map(el=>createRecipeItem(el)).join(' ')}
                </ul>
                <button class="btn-small recipe__btn js-1">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
             </div>
              <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.source}</span>. Please check out directions at EDAMAM.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.shareAs}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
`
DOMElements.recipeContainer.insertAdjacentHTML('afterbegin', markup)
};

export const deleteRecipe = () => {
DOMElements.recipeContainer.innerHTML='';
};
