// step 1: get URL parameters of search from URL

const urlParamsStr = document.location.href;
const mediaTypeCheckboxMovie = $(`#movies`);
const mediaTypeCheckboxTvShow = $(`#tv-shows`);

const urlParamsArr = [];

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
}

getUrlParam(urlParamsStr);

const mediaType = urlParamsArr[0][1];
console.log(mediaType);

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

setCheckBoxes();

// console.log(urlParamsArr);