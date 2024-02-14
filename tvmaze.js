"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
//TODO: add global constant for default URL and the api for tvmaze

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const params = new URLSearchParams({q: term});
  const response = await fetch(`http://api.tvmaze.com/search/shows?${params}`);
  const searchData = await response.json();
  const listOfShows = [];
  // TODO: use map to refactor
  for(const data of searchData) {
    let imgUrl;
    if(data.show.image === null) {
      imgUrl = "https://tinyurl.com/tv-missing";
    }
    else {
      imgUrl = data.show.image.medium;
    }

    const show = {
      id: data.show.id,
      name: data.show.name,
      summary: data.show.summary,
      image: imgUrl
    }

    listOfShows.push(show);
  }

  return listOfShows;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
