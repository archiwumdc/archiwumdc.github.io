let data;
let selectedSeria = null;
let selectedOdc = null;
const cookieSeria = getCookie("seria");
const cookieOdc = getCookie("odc");

fetch("data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData;
    populateSerie();
  });

function populateSerie() {
  const Serie = document.getElementById("serie");

  Object.keys(data).forEach((key) => {
    if (data[key].length == 0) {
      return;
    }
    const seria = document.createElement("a");
    seria.textContent = key;
    seria.onclick = function () {
      selectSeria.call(this);
      document.cookie = "seria=" + selectedSeria + "; max-age=2592000;";
      document.cookie = "odc=0; max-age=2592000;";
    };
    Serie.appendChild(seria);
  });

  if (cookieSeria != null && cookieOdc != null) useCookies();
}

function useCookies() {
  const serieList = document.getElementById("serie").getElementsByTagName("a");

  for (let i = 0; i < serieList.length; i++) {
    if (serieList[i].textContent.trim() === cookieSeria) {
      selectSeria.call(serieList[i]);
      break;
    }
  }

  selectOdc(cookieOdc);
}

function getCookie(name) {
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].trim().split("=");

    if (cookiePair[0] === name) {
      return cookiePair[1];
    }
  }
  return null;
}

function selectSeria() {
  if (document.getElementById("noselect")) {
    document.getElementById("noselect").remove();
  }

  if (selectedSeria != this.textContent) {
    selectedSeria = this.textContent;
    document.querySelector(".controls #title").textContent = "";
    document.querySelector(".controls #data").textContent = "";
    document.querySelector("#video iframe").src = "";

    document
      .getElementById("source")
      .querySelectorAll("option")
      .forEach((option) => {
        option.remove();
      });

    selectedOdc = null;
    populateOdc();
  }

  const activeSeria = document
    .getElementById("serie")
    .querySelector("a.active");
  if (activeSeria) {
    activeSeria.classList.remove("active");
  }

  this.className = "active";
}

function populateOdc() {
  const sidebar = document.getElementById("sidebar");
  let ep = -1;

  sidebar.querySelectorAll("a").forEach((a) => {
    a.remove();
  });

  const episodes = data[selectedSeria];

  episodes.forEach((episode) => {
    const a = document.createElement("a");
    const number = document.createElement("number");

    ep = ep + 1;
    a.setAttribute("data-ep", ep);

    if (episode.odc === undefined) {
      number.textContent = `#0`;
    } else {
      number.textContent = `#${episode.odc}`;
    }

    a.appendChild(number);

    if (episode.title === undefined) {
      a.appendChild(document.createTextNode(` ?`));
      a.title = selectedSeria;
    } else {
      a.appendChild(document.createTextNode(` ${episode.title}`));
      a.title = episode.title;
    }

    if (episode.source === undefined) {
      a.className = "disabled";
    }

    sidebar.appendChild(a);

    a.onclick = function () {
      selectOdc.call(this, this.dataset.ep);
    };

    if (selectedOdc == null) {
      selectOdc(0);
    }
  });
}

function selectOdc(OdcNumber) {
  let Odc = document.querySelector('a[data-ep="' + OdcNumber + '"]');

  if (Odc.className == "active" || Odc.className == "disabled") {
    return;
  }

  selectedOdc = Odc.dataset.ep;
  document.cookie = "odc=" + selectedOdc + "; max-age=2592000;";

  const activeOdc = document
    .getElementById("sidebar")
    .querySelector("a.active");
  if (activeOdc) {
    activeOdc.classList.remove("active");
  }

  Odc.className = "active";

  ODC = data[selectedSeria][selectedOdc];

  if (ODC.title === undefined) {
    document.querySelector(".controls #title").textContent = selectedSeria;
  } else {
    document.querySelector(".controls #title").textContent = ODC.title;
  }
  document.querySelector(".controls #data").textContent = ODC.date;

  document.querySelector("#video iframe").src = "";
  document.querySelector("#video iframe").src = ODC.link;
  document.querySelector("#video iframe").style.display = "";

  document
    .getElementById("source")
    .querySelectorAll("option")
    .forEach((option) => {
      option.remove();
    });

  let source1 = document.createElement("option");
  source1.textContent = ODC.source;
  source1.value = ODC.link;
  document.getElementById("source").appendChild(source1);

  if ("source2" in ODC) {
    let source2 = document.createElement("option");
    source2.textContent = ODC.source2;
    source2.value = ODC.link2;
    document.getElementById("source").appendChild(source2);
  }

  if ("source3" in ODC) {
    let source3 = document.createElement("option");
    source3.textContent = ODC.source3;
    source3.value = ODC.link3;
    document.getElementById("source").appendChild(source3);
  }

  if ("source4" in ODC) {
    let source4 = document.createElement("option");
    source4.textContent = ODC.source4;
    source4.value = ODC.link4;
    document.getElementById("source").appendChild(source4);
  }

  if ("source5" in ODC) {
    let source5 = document.createElement("option");
    source5.textContent = ODC.source5;
    source5.value = ODC.link5;
    document.getElementById("source").appendChild(source5);
  }
}

function nextOdc() {
  if (selectedSeria == null) {
    return;
  }

  let EpChildren = document.getElementById("sidebar").children;
  let found = false;

  for (let i = 0; i < EpChildren.length; i++) {
    if (
      Number(EpChildren[i].dataset.ep) > selectedOdc &&
      EpChildren[i].className !== "disabled"
    ) {
      selectOdc(EpChildren[i].dataset.ep);
      found = true;
      break;
    }
  }

  if (!found) {
    for (let i = 0; i < EpChildren.length; i++) {
      if (
        Number(EpChildren[i].dataset.ep) <= selectedOdc &&
        EpChildren[i].className !== "disabled"
      ) {
        selectOdc(EpChildren[i].dataset.ep);
        break;
      }
    }
  }
}

// ----------------------------------------------
function navFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function searchOdc() {
  var input, filter, sidebar, odc, i;
  input = document.getElementById("searchOdc");
  filter = input.value.toUpperCase();
  sidebar = document.getElementById("sidebar");
  odc = sidebar.getElementsByTagName("a");

  for (i = 0; i < odc.length; i++) {
    if (odc[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      odc[i].style.display = "";
    } else {
      odc[i].style.display = "none";
    }
  }
}

function searchSeria() {
  var input, filter, dropdownContent, series, i;
  input = document.getElementById("searchSeria");
  filter = input.value.toUpperCase();
  dropdownContent = document.querySelector(".dropdown-content");
  series = dropdownContent.getElementsByTagName("a");

  for (i = 0; i < series.length; i++) {
    if (series[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      series[i].style.display = "";
    } else {
      series[i].style.display = "none";
    }
  }
}
