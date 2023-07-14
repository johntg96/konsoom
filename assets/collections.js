// step 1: get URL parameters of search from URL

const urlParamsStr = document.location.href;

const urlParamsArr = [];

function getUrlParam(paramName){
  const params = document.location.search.slice(1);
  const allPairs = params.split("&");
  allPairs.forEach(function(pair){
      const parsed = pair.split("=");
      console.log(parsed);
      urlParamsArr.push(parsed);
      if( parsed[0] === paramName ){
          console.log("We have found what we seek: " + parsed[1]);
      }
  })
}

getUrlParam(urlParamsStr);
console.log(urlParamsArr);