const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);
let darkMode = localStorage.getItem(`darkMode`);

const handleFormSubmit = () => {
  let search = searchBox.val();
  let mediaType;

  function checkBoxCheck() {
    const radios = document.getElementsByName('media-type');
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        mediaType = radios[i].value;
        return mediaType;
      }
    }
  }

  let urlQuery = `./search-page.html?media-type=${checkBoxCheck()}&search=${search}`; // <- ?key=value // <- URL Set Parameters
  location.assign(urlQuery);
  // 
}

searchBoxBtn.on(`click`, function(event) {
  event.preventDefault();
  handleFormSubmit();
});

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
    $(`#flexSwitchCheckChecked`).prop("checked", true); // set dark mode visual toggle/switch to correct position
    changeColor($(`.navbar-brand`));
  } else {
    document.body.dataset.bsTheme = "light";
    $(`#flexSwitchCheckChecked`).prop("checked", false);
  }
}

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
  return { poster, title, type, year };
}

// add movie to watchlist
function addToWatchlist(movie, isInWatchlist) {
  const isAlreadyAdded = watchlistMovies.some((m) => m.title === movie.title);

  if (isAlreadyAdded) {
    alert(`${movie.title} is already in your watchlist.`);
    return; // Exit the function without adding the movie again
  }

  watchlistMovies.push(movie);
  const watchlistResults = $("#watchlist-results");

  const card = `
      <div class="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 align-self-end">
        <div class="card mt-2">
          <div class="card-header text-center">
            <img class="card-img-top img-fluid animate__animated animate__fadeIn" src="${movie.poster}"/>
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

// remove movie from watchlist
function removeFromWatchlist(movie) {
  const index = watchlistMovies.findIndex((m) => m.title === movie.title && m.year === movie.year);

  if (index !== -1) {
    watchlistMovies.splice(index, 1);
  }

  // Update local storage with the updated watchlist
  localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));

  // Re-render the watchlist after removing the movie
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
            <img class="card-img-top img-fluid animate__animated animate__fadeIn" src="${movie.poster}"/>
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

setDarkMode(darkMode);
retrieveWatchlist();