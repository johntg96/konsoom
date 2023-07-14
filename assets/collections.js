// step 1: get URL parameters of search from URL
const omdpApiKey = `ab8ac5ee`;
const omdpApiRootUrl = `http://www.omdbapi.com/?apikey=${omdpApiKey}&`;
const urlParamsStr = document.location.href;
const mediaTypeCheckboxMovie = $(`#movies`);
const mediaTypeCheckboxTvShow = $(`#tv-shows`);
const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);

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
  if (mediaType === 'movies') {
    console.log('movie checked');
    mediaTypeCheckboxMovie.prop("checked", true);
    mediaTypeCheckboxTvShow.prop("checked", false);
  } else if (mediaType === 'tv-shows') {
    console.log('tv-show checked');
    mediaTypeCheckboxTvShow.prop("checked", true);
    mediaTypeCheckboxMovie.prop("checked", false);
  } else {
    console.log('No media-type selection (checkboxes).');
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

  let urlQuery = `./log.html?media-type=${checkBoxCheck()}&search=${search}`; // <- ?key=value // <- URL Set Parameters
  location.assign(urlQuery);
}

function searchApi() {
  let apiUrl = `${omdpApiRootUrl}t=${urlParamsArr[1][1]}`; // also add "&type=" to URL to filter by media type (movie or tv show)
  console.log(apiUrl);

  fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })

  // $.ajax({url:apiUrl})
  // .then(function (response) {
  //   console.log(response)
  // });
}

// search button event listener
searchBoxBtn.on(`click`, function(event) {
  event.preventDefault();
  handleFormSubmit();
});


getUrlParam(urlParamsStr);
setCheckBoxes();
searchApi();