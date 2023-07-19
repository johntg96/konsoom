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

setDarkMode(darkMode);