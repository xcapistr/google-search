"use strict";

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function alertMessage(msg){
  var alertElement = document.getElementById("alert");
  alertElement.classList.remove("hide");
  alertElement.innerHTML = msg;
}

function getImages(searchQuery, num, start){
  try {
    var response = httpGet(
      `https://www.googleapis.com/customsearch/v1?key=AIzaSyBRO-RVtdrSX1KsxluZZ9qFxDTKRFXSv3g&cx=013578484775797802166:imakecqrzp4&q=${searchQuery}&searchType=image&num=${num}&start=${start}`
    );
    return JSON.parse(response).items;
  } catch (e) {
    console.log('chyba', e);
    document.getElementById("results-container").classList.add("hide");
    alertMessage('Chyba: server nevrátil odpoveď.');
    return null;
  }
}

function getWebs(searchQuery, num, start) {
  try {
    var response = httpGet(
      `https://www.googleapis.com/customsearch/v1?key=AIzaSyBRO-RVtdrSX1KsxluZZ9qFxDTKRFXSv3g&cx=013578484775797802166:imakecqrzp4&q=${searchQuery}&num=${num}&start=${start}`
    );
    return JSON.parse(response).items;
  } catch (e) {
    console.log('chyba', e);
    document.getElementById("results-container").classList.add("hide");
    alertMessage('Chyba: server nevrátil odpoveď.');
    return null;
  }
}

function showImage(image){
  console.log('sfdsfsd');
  console.log(image);
}

function showModal(e) {
  var element = e.srcElement
  var modal = document.getElementById("modal");
  modal.classList.remove("hide");
  var modalImage = document.getElementById("modal-image");
  modalImage.style.backgroundImage = element.style.backgroundImage;
  var imgAddr = document.getElementById("img-address");
  imgAddr.innerHTML = element.title;
  imgAddr.onclick = function() {
    window.location = element.title;
  };
}

function renderImages(queryString) {
  var images = getImages(queryString, 9, 1);
  var imagesContainer = document.getElementById("images-container");
  var noImages = document.getElementById("no-images");
  if (!images){
    console.log("zero images");
    imagesContainer.classList.add("hide");
    noImages.classList.remove("hide");
  } else {
    imagesContainer.classList.remove("hide");
    noImages.classList.add("hide");

    var images2 = getImages(queryString, 9, 2);

    for (var i = 0; i < images.length; i++) {
      var imageCard = document.getElementById("image-card-" + i);
      imageCard.style.backgroundImage = "url('" + images[i].link + "')";
      imageCard.title = images[i].image.contextLink;
      imageCard.onclick = showModal;
    }

    for (var i = 0; i < images2.length; i++) {
      console.log(i);
      var imageCard = document.getElementById(
        "image-card-" + (i + images.length)
      );
      imageCard.style.backgroundImage = "url('" + images2[i].link + "')";
      imageCard.title = images2[i].image.contextLink;
      imageCard.onclick = showModal;
    }
  }
}

function renderWebs(queryString) {
  var webs = getWebs(queryString, 6, 1);
  var websContainer = document.getElementById("webs-container");
  var noWebs = document.getElementById("no-webs");
  if (!webs){
    console.log("zero webs");
    websContainer.classList.add("hide");
    noWebs.classList.remove("hide");
  } else {
    websContainer.classList.remove("hide");
    noWebs.classList.add("hide");
    for (var i = 0; i < webs.length; i++) {
      var webCard = document.getElementById("web-card-" + i);
      // nastavenie webCard
      var h2 = document.createElement("h2");
      if (webs[i].htmlTitle.length >= 40){
        h2.innerHTML = webs[i].htmlTitle.slice(-40) + '...';
      } else {
        h2.innerHTML = webs[i].htmlTitle;
      };
      webCard.appendChild(h2);
      var h4 = document.createElement("h4");
      h4.innerHTML = webs[i].displayLink;
      webCard.appendChild(h4);
      var p = document.createElement("p");
      p.innerHTML = webs[i].htmlSnippet
        .replace(/<br>/g, " ")
        .replace(/↵/g, " ")
        .replace(/\b\n/g, " ")
        .replace(/&nbsp;/g, " ");
      webCard.appendChild(p);
      webCard.href = webs[i].link;
    }
  }
}

function refreshSearch() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var search = url.searchParams.get("search");

  var images = getImages(search, 12, 1);
}

function hideModal() {
  var modal = document.getElementById("modal");
  modal.classList.add("hide");
}

function openModal(img) {
  var modal = document.getElementById("modal");
  modal.classList.remove("hide");
  var modalImage = document.getElementById("modal-image");
  modalImage.style.backgroundImage = "url('" + img.link + "')";
  console.log(img);
}

var url_string = window.location.href;
var url = new URL(url_string);
var search = url.searchParams.get("search");

if (search && search != "") {
  var inputText = document.getElementById("search-query");
  inputText.value = search;
  renderImages(search);
  renderWebs(search);
} else {
  document.getElementById("results-container").classList.add("hide");
}
