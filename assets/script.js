const searchBox = $(`#search-box`);
const searchBoxBtn = $(`#search-box-btn`);

const omdpApiRootUrl = `http://www.omdbapi.com/?apikey=[yourkey]&`;

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

  document.location.href = `?${checkBoxCheck()}=${search}`; // <- ?key=value // <- URL Set Parameters
}

searchBoxBtn.on(`click`, function(event) {
  event.preventDefault();
  handleFormSubmit();
});