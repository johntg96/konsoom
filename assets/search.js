// step 1: get URL parameters of search from URL
const omdpApiKey = `ab8ac5ee`;
const omdpApiRootUrl = `http://www.omdbapi.com/?apikey=${omdpApiKey}&`;
const urlParamsStr = document.location.href;
const mediaTypeCheckboxAllTypes = $(`#all-types`);
const mediaTypeCheckboxMovie = $(`#movie`);
const mediaTypeCheckboxSeries = $(`#series`);
const mediaTypeCheckboxEpisode = $(`#episode`);
const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);
const searchResults = $(`#search-results`);

const urlParamsArr = [];
let mediaType;

// create an array of the URL parameters
function getUrlParam(paramName){
  const params = document.location.search.slice(1);
  const allPairs = params.split("&");
  allPairs.forEach(function(pair){
      const parsed = pair.split("=");
      urlParamsArr.push(parsed);
      urlParamsArr.mediaType
      if( parsed[0] === paramName ){
          console.log("We have found what we seek: " + parsed[1]);
      }
  })
  mediaType = urlParamsArr[0][1];
}

// make sure the media selection checkboxes reflect search
function setCheckBoxes() {
  // set 'checked' property of radio button
  switch (mediaType) {
    case (`all-types`):
      mediaTypeCheckboxAllTypes.prop("checked", true);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case (`movie`):
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", true);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case (`series`):
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", true);
      mediaTypeCheckboxEpisode.prop("checked", false);
      break;
    case (`episode`):
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", true);
      break;
    default:
      mediaTypeCheckboxAllTypes.prop("checked", false);
      mediaTypeCheckboxMovie.prop("checked", false);
      mediaTypeCheckboxSeries.prop("checked", false);
      mediaTypeCheckboxEpisode.prop("checked", false)
      break;
  }
}

// handle search input, create URL and travel to it
function handleFormSubmit() {
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
}

function searchApi() {
  let apiUrl;

  if (mediaType !== `all-types`) {
    apiUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}&type=${mediaType}`; // also add "&type=" to URL to filter by media type (movie, series, or episode)
  } else {
    apiUrl = `${omdpApiRootUrl}s=${urlParamsArr[1][1]}`;
  }
  
  console.log(apiUrl);

  fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    renderSearchResults(data);
  })

  // $.ajax({url:apiUrl})Minneapolis
  // .then(function (response) {
  //   console.log(response)
  // });
}

// search button event listener
searchBoxBtn.on(`click`, function(event) {
  event.preventDefault();
  handleFormSubmit();
});

function renderSearchResults(searchData) {

  function renderCard(poster, title, type, year) {
    console.log(poster, title, type, year);

    if (poster == 'N/A') {
      poster = `./assets/images/200x200.png`
    }

    // HTML bootstrap card created dynamically here:
    searchResults.append(`
    <div class="col-3">
      <div class="card mt-2">
        <div class="card-header">
          <div class="card-body">
            <img class="card-img-top" src="${poster}"/>
            <p class="card-text">${title}<br/>${type}<br/>${year}</p>
            <button class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
    `);
  }


  // console.log(searchData.Search[0].Title);
  searchData.Search.forEach((result) => {
    renderCard(result.Poster, result.Title, result.Type, result.Year);
  });
}

getUrlParam(urlParamsStr);
setCheckBoxes();
searchApi();