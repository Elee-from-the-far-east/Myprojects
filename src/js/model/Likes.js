export default class Likes {
  constructor() {
    this.likes = [];
  }

  toggleRecipe(recipe) {
    const index = this.likes.findIndex((el) => el.recipeId === recipe.recipeId);
    if (index > -1) {
      const deleted = this.likes.splice(index, 1);
      this.storeToLocalStorage();
      return deleted[0].recipeId;
    } else {
      this.likes.push(recipe);
      this.storeToLocalStorage();
      return recipe.recipeId;
    }
  }

  findRecipe(id) {
    return this.likes.find((el) => el.recipeId === id);
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  storeToLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  getDataFromLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
