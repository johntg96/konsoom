const omdpApiKey = `ab8ac5ee`;
const omdpApiRootUrl = `https://www.omdbapi.com/?apikey=${omdpApiKey}&`;
const urlParamsStr = document.location.href;
const mediaTypeCheckboxAllTypes = $(`#all-types`);
const mediaTypeCheckboxMovie = $(`#movie`);
const mediaTypeCheckboxSeries = $(`#series`);
const mediaTypeCheckboxEpisode = $(`#episode`);
const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);
const searchResults = $(`#search-results`);
let watchlistMovies = []; // Updated to store watchlist movies

const urlParamsArr = [];
let darkMode = localStorage.getItem(`darkMode`);
let mediaType;

// create an array of the URL parameters
function getUrlParam(paramName) {
  const params = document.location.search.slice(1);
  const allPairs = params.split("&");
  allPairs.forEach(function (pair) {
    const parsed = pair.split("=");
    urlParamsArr.push(parsed);
    urlParamsArr.mediaType;
    if (parsed[0] === paramName) {
      console.log("We have found what we seek: " + parsed[1]);
    }
  });
  
  mediaType = urlParamsArr[0][1];
}

// make sure the media selection checkboxes reflect search
function setCheckBoxes() {
  // set 'checked' property of radio button
  switch (mediaType) {
    case "all-types":
      mediaTypeCheckboxAllTypes.prop("checked", true);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case "movie":
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", true);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case "series":
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", true);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case "episode":
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", true);
      break;
    default:
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
  }

  searchBox.val(decodeURI(urlParamsArr[1][1])); // sets search box input value to search URL parameter
}

// handle search input, create URL, and travel to it
function handleFormSubmit() {
  const search = searchBox.val();
  let mediaType;

  function checkBoxCheck() {
    const radios = document.getElementsByName("media-type");
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        mediaType = radios[i].value;
        return mediaType;
      }
    }
  }

  const urlQuery = `./search-page.html?media-type=${checkBoxCheck()}&search=${search}`; // <- ?key=value // <- URL Set Parameters
  location.assign(urlQuery);
}

// search API and render search results
function searchApi() {
  let apiUrl;

  if (mediaType !== "all-types") {
    apiUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}&type=${mediaType}`; // Also add "&type=" to URL to filter by media type (movie, series, or episode)
  } else {
    apiUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}`;
  }

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderSearchResults(data);
    });
}

// search button event listener
searchBoxBtn.on("click", function (event) {
  event.preventDefault();
  handleFormSubmit();
});

// render search results
function renderSearchResults(searchData) {
  let isInWatchlist; // Define the variable here
  let totalResults = searchData.totalResults;
  let resultsPerPage = 10;
  console.log(totalResults);

  // This calculates the number of pages needed. '.ceil' method rounds to the  next integer.
  function calcNumPages(totalResults, resultsPerPage) {
    return Math.ceil(totalResults / resultsPerPage)
  }
  // Display number of pages of results
  console.log(calcNumPages(totalResults, resultsPerPage));
  $(`#results-info`).append(`<br/>Total Results: <strong>${totalResults}</strong></br>`);

  if (searchData.Response === "True") {
    let totalSearchPages = calcNumPages(totalResults, resultsPerPage);

    for (let i = 1; i <= totalSearchPages; i++) {
      let apiSearchUrl;

      if (mediaType !== "all-types") {
        apiSearchUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}&type=${mediaType}&page=${i}`;
      } else {
        apiSearchUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}&page=${i}`;
      }

      console.log(apiSearchUrl);
      
      fetch(apiSearchUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function (pageResults) {
        console.log(pageResults);

        pageResults.Search.forEach((result) => {
          isInWatchlist = watchlistMovies.some((movie) => movie.imdbID === result.imdbID);
          renderCard(result.Poster, result.Title, result.Type, result.Year, isInWatchlist);
        });
      })
    }
    
  } else {
    searchResults.html(`
      <h4 class="mt-5">No Results</h4>
    `);
  }
}

// render individual card in search results
function renderCard(poster, title, type, year, isInWatchlist) {
  if (poster === "N/A") {
    poster = "./assets/images/200x300.png";
  }

  const saveButtonText = isInWatchlist ? "Remove" : "Save";
  const card = `
    <div class="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 align-self-end">
      <div class="card mt-2">
        <div class="card-header text-center">
          <img class="card-img-top img-fluid" src="${poster}"/>
        </div>
        <div class="card-body">
          <h6 class="card-title">${title}</h6>
          <p class="card-text">${type}</p>
          <p class="card-text">${year}</p>
        </div>
        <div class="card-footer">
          <button class="btn ${isInWatchlist ? "btn-danger remove-btn" : "btn-success save-btn"}" style="width:100%;">${saveButtonText}</button>
        </div>
      </div>
    </div>
  `;

  searchResults.append(card);
}

// save and remove buttons
searchResults.on("click", ".save-btn", function () {
  const card = $(this).closest(".card");
  const cardData = getCardData(card);
  const isInWatchlist = $(this).data("isInWatchlist") === true;
  addToWatchlist(cardData, isInWatchlist);
  card.remove(); // remove the card from the search results
  $(this).replaceWith(`<button class="btn btn-danger remove-btn" style="width:100%;">Remove</button>`);
});

$("#watchlist-results").on("click", ".remove-btn", function () {
  const card = $(this).closest(".card");
  const cardData = getCardData(card);
  removeFromWatchlist(cardData);
});

// get card data
function getCardData(card) {
  const poster = card.find(".card-img-top").attr("src");
  const title = card.find(".card-title").text();
  const type = card.find(".card-text").eq(0).text();
  const year = card.find(".card-text").eq(1).text();
  const imdbID = card.data("imdbID");
  return { poster, title, type, year, imdbID };
}

// add movie to watchlist
function addToWatchlist(movie, isInWatchlist) {
  if (!isInWatchlist) {
    watchlistMovies.push(movie);
    const watchlistResults = $("#watchlist-results");

    const card = `
      <div class="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 align-self-end">
        <div class="card mt-2">
          <div class="card-header text-center">
            <img class="card-img-top img-fluid" src="${movie.poster}"/>
          </div>
          <div class="card-body">
            <h6 class="card-title">${movie.title}</h6>
            <p class="card-text">${movie.type}</p>
            <p class="card-text">${movie.year}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-danger remove-btn" style="width:100%;">Remove</button>
          </div>
        </div>
      </div>
    `;

    watchlistResults.append(card);
    alert(`${movie.title} has been added to your watchlist.`);

    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
  }
}

// remove movie from watchlist
function removeFromWatchlist(movie) {
  const index = watchlistMovies.findIndex((m) => m.imdbID === movie.imdbID);
  if (index !== -1) {
    watchlistMovies.splice(index, 1);
  }

  // update local storage with the updated watchlist
  localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));

  // re-render the watchlist after removing the movie
  renderWatchlist();
}

// retrieve watchlist from local storage on page load
function retrieveWatchlist() {
  const storedWatchlist = localStorage.getItem('watchlist');
  if (storedWatchlist) {
    watchlistMovies = JSON.parse(storedWatchlist);
    renderWatchlist();
  }
}

// render watchlist on page load
function renderWatchlist() {
  const watchlistResults = $("#watchlist-results");
  watchlistResults.empty();

  watchlistMovies.forEach((movie) => {
    const card = `
      <div class="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 align-self-end">
        <div class="card mt-2">
          <div class="card-header text-center">
            <img class="card-img-top img-fluid" src="${movie.poster}"/>
          </div>
          <div class="card-body">
            <h6 class="card-title">${movie.title}</h6>
            <p class="card-text">${movie.type}</p>
            <p class="card-text">${movie.year}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-danger remove-btn" style="width:100%;">Remove</button>
          </div>
        </div>
      </div>
    `;

    watchlistResults.append(card);
  });
}

// change an elements styling for dark mode
function changeColor(element) {
  element.toggleClass("dark-toggle");
}

//light dark switch
function toggleDark() {
  // set body to dark mode
  var element = document.body;
  element.dataset.bsTheme = element.dataset.bsTheme == "light" ? "dark" : "light";

  // store dark mode preference in local storage
  if (element.dataset.bsTheme == 'dark') {
    localStorage.setItem(`darkMode`, `dark`);
  } else {
    localStorage.setItem(`darkMode`, `light`);
  }

  console.log(`dark mode setting: ${localStorage.getItem(`darkMode`)}`);

  // change navbar title color on theme change
  changeColor($(`.navbar-brand`));
}

// purpose: keep dark mode persistent across page refresh
function setDarkMode(mode) {
  if (mode == 'dark') {
    document.body.dataset.bsTheme = `dark`;
    changeColor($(`.navbar-brand`));
  } else {
    document.body.dataset.bsTheme = "light";
  }
  
}

setDarkMode(darkMode);
retrieveWatchlist();
getUrlParam(urlParamsStr);
setCheckBoxes();
searchApi();