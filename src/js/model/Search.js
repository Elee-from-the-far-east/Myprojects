import axios from 'axios';

export default class Search {
  constructor(searchString){
    this.searchString = searchString;
  }

  getData (){
    return axios.get("https://edamam-recipe-search.p.rapidapi.com/search", {
      headers: {
        "x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
        "x-rapidapi-key": "dc9b00f8b4msh41738f2d51091efp19deedjsne3da85136b13",
      },
      params: {
        q: this.searchString,
        from: 0,
        to: 30,
      },
    }).then(response => {
      this.searchResults = response.data.hits;
      console.log(response)
    })
    .catch(err => {
      alert(err);
    });
  }
}
