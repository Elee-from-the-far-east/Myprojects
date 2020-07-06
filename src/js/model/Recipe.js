import { makeFirstLetterUp } from "../view/utils";

export default class Recipe {
  constructor(data, id) {
    this.recipe = data[id].recipe;
    this.recipeId = id;
  }

  parseRecipeIngredients() {
    const unitsMap = {
      teaspoons: "tsp",
      teaspoon: "tsp",
      tablespoons: "tbsp",
      tablespoon: "tbsp",
      ounces: "oz",
      ounce: "oz",
      pounds: "pound",
      cups: "cup",
      g: "g",
      ml: "ml",
      "oz.": "oz",
    };

    this.ingredients = this.recipe.ingredientLines.map((el) => {
      for (const unitsMapKey in unitsMap) {
        if (unitsMap.hasOwnProperty(unitsMapKey)) {
          el = el.replace(unitsMapKey, unitsMap[unitsMapKey]);
        }
      }
      el = el
        .replace(/ *\([^)]*\)*/g, " ")
        .replace(/ {2,}/g, " ")
        .replace(/ , /g, ", ")
        .trim();
      el = el.split(" ");
      const index = el.findIndex((i) => Object.values(unitsMap).includes(i));
      if (index > -1) {
        return {
          count: el.slice(0, index).join(" "),
          unit: el[index],
          text: el
            .slice(index + 1)
            .join(" ")
            .toLowerCase(),
        };
      }
      if (
        Number(el[0]) ||
        Number(el[0].split("-")[0]) ||
        Number(el[0].split("")[0])
      ) {
        return {
          count: el[0],
          unit: "",
          text: el.slice(1).join(" ").toLowerCase(),
        };
      }
      if (index === -1) {
        return {
          count: "1",
          unit: "",
          text: el.join(" ").toLowerCase(),
        };
      }
    });
  }
}


