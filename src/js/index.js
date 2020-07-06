// Global app controller
import Search from "./model/Search";
import Recipe from "./model/Recipe";
import ShoppingList from "./model/ShoppingList";
import Likes from "./model/Likes";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as shoppingListView from "./view/shoppingListView";
import * as likesView from "./view/likesView";

import {
  DOMElements,
  renderLoadSpinner,
  deleteLoadSpinner,
  querySelector,
} from "./view/utils";

/*global state
 *-search object
 * -current recipe obj
 * -shopping list object
 * -likes object
 * */
const state = {};

/**
 SEARCH CONTROLLER
 */
const submitSearchHandler = (e) => {
  e.preventDefault();
  //get searchSearch string from view
  const searchString = searchView.getInput().trim();

  //store instance of Search in state
  if (searchString) {
    state.search = new Search(searchString);
    //prepare user ui for rendering search results
    searchView.clearInput();
    searchView.clearResultsList();
    renderLoadSpinner(DOMElements.resultsList);
    //get data from remote server based on user input
    state.search
      .getData()
      //render search results to user ui
      .then(() => {
        deleteLoadSpinner(querySelector.spinner);
        searchView.renderRecipeElements(
          state.search.searchResults,
          clickRecipeHandler
        );
        likesView.highlightMenuHeart(state.likes.getNumberOfLikes());
      });
  }
};

const searchButtonClickHandler = (e) => {
  const btn = e.target.closest("button");
  if (btn) {
    let buttonNumber = btn.querySelector("span").textContent.split(" ")[1];
    buttonNumber = Number(buttonNumber);
    searchView.clearResultsList();
    searchView.deleteButtons();
    searchView.renderRecipeElements(
      state.search.searchResults,
      clickRecipeHandler,
      buttonNumber
    );
  }
};

DOMElements.searchForm.addEventListener("submit", submitSearchHandler);
DOMElements.searchButtonsContainer.addEventListener(
  "click",
  searchButtonClickHandler
);

/**
 RECIPE CONTROLLER
*/

const clickRecipeHandler = (id) => {
  searchView.highlightSelected(id, state.search);
  state.pickedRecipe = new Recipe(state.search.searchResults, id);
  state.pickedRecipe.parseRecipeIngredients();
  recipeView.deleteRecipe();
  recipeView.renderRecipe(
    state.pickedRecipe.recipe,
    state.pickedRecipe.ingredients
  );
  if (state.likes && state.likes.likes.some((el) => el.recipeId === id))
    likesView.highlightHeart();
};

/**
 SHOPPINGLISTCONTROLLER CONTROLLER
 */

const shoppingListClickHandler = (e) => {
  if (e.target.closest(".js-1")) {
    if (!state.shoppingList) state.shoppingList = new ShoppingList();
    state.pickedRecipe.ingredients.forEach((el) =>
      shoppingListView.renderItem(state.shoppingList.addItem(el))
    );
  }
};

const deleteItemHandler = (e) => {
  if (e.target.closest(querySelector.shopDeleteBtn)) {
    const id = e.target.closest(querySelector.shoppingItem).id;
    state.shoppingList.deleteItem(id);
    shoppingListView.deleteItem(id);
  }
};

DOMElements.shoppingList.addEventListener("click", deleteItemHandler);
DOMElements.recipeContainer.addEventListener("click", shoppingListClickHandler);

/**
 LIKES CONTROLLER
 */

const addLikeHandler = (e) => {
  if (e.target.closest(querySelector.likeBtn)) {
    likesView.highlightHeart();
    const id = state.likes.toggleRecipe(state.pickedRecipe);
    const recipe = state.likes.findRecipe(id);
    if (recipe) likesView.createRecipeElement(recipe, clickLikedRecipeHandler);
    else likesView.deleteElement(id);
    likesView.highlightMenuHeart(state.likes.getNumberOfLikes());
  }
};

const clickLikedRecipeHandler = (id) => {
  recipeView.deleteRecipe();
  const likedRecipe = state.likes.findRecipe(id);
  state.pickedRecipe = likedRecipe;
  recipeView.renderRecipe(likedRecipe.recipe, likedRecipe.ingredients);
  likesView.highlightHeart();
  searchView.highlightSelected(id, state.search);
};

DOMElements.recipeContainer.addEventListener("click", addLikeHandler);

window.addEventListener("load", () => {
  state.likes = new Likes();
  if (localStorage.likes) {
    state.likes.getDataFromLocalStorage();
    state.likes.likes.forEach((el) =>
      likesView.createRecipeElement(el, clickLikedRecipeHandler)
    );
    likesView.highlightMenuHeart(state.likes.getNumberOfLikes());
  }
});
