const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);

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