import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

// global state
// search object
// current reciept
// shoping list
// likes

const state = {};

const controlSearch = async () => {
    // 1) get the query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert('AHTUNG');
            clearLoader();
        }

        
    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#','');
    console.log(id);

    if (id) {
        // prepare ui for changes

        // create new reciep
        state.recipe = new Recipe(id);

        // get rec data
        try {
            await state.recipe.getRecipe();

            //  add trash numbers
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render
            console.log(state.recipe);
        }
        catch (err) {
            alert('AHTUNG');
        }
    }

};

window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load', controlRecipe);

