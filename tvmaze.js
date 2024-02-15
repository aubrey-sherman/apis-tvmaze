"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const DEFAULT_IMG_URL = "https://tinyurl.com/tv-missing";
const API_TVMAZE_URL = "http://api.tvmaze.com";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const params = new URLSearchParams({ q: term });
  const response = await fetch(`${API_TVMAZE_URL}/search/shows?${params}`);
  const searchData = await response.json();

  return searchData.map(function (data) {
    return {
      id: data.show.id,
      name: data.show.name,
      summary: data.show.summary,
      image: data.show.image ? data.show.image.medium : DEFAULT_IMG_URL,
    };
  });
}


/**Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
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
 *    Clears the shows list
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $showsList.empty();
  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(showId) {
  const response = await fetch(`${API_TVMAZE_URL}/shows/${showId}/episodes`);
  const episodes = await response.json();

  return episodes.map(function(episode) {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };
  });
}

/** Empty the list of shows
 *
 *  Given a (promise) array of episode objects, retrieve info about each episode
 *  and append a new list element containing this info to the DOM
 *
 *  Unhide previously hidden episode area
 */

function displayEpisodes(episodes) {
  $("#episodesList").empty();

  for (let episode of episodes) {
    const episodeInfo = $(`<li>${episode.name} (Season ${episode.season},
      Number ${episode.number})</li>`);
    $("#episodesList").append(episodeInfo);
  }

  $episodesArea.show();
}

/** Given a show's ID, retrieve its episodes and display them on the page */

async function getEpisodesAndDisplay(showId) {
  const episodes = await getEpisodesOfShow(showId);
  displayEpisodes(episodes);
}

/** Handles clicking of the Episodes button under each show */

async function handleEpisodeButtonClick(event) {
  const showId = Number($(event.target).closest(".Show").data("show-id"));

  await getEpisodesAndDisplay(showId);
}

$showsList.on("click", ".Show-getEpisodes", handleEpisodeButtonClick);