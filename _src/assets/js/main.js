'use strict';

// import { format } from "util";




const elementForm = document.querySelector('#js-form');
const elementButton = document.querySelector('#js-button');
const elementInput = document.querySelector('#js-input');
const elemenListFav = document.querySelector('#js-fav-list');
const elementListResult = document.querySelector('#js-results-list');
const urlBase = 'http://api.tvmaze.com/search/shows?q=';
let listResultContain = '';
let listResultFavorites='';
let favoritesObj = [];


//me conecto a la api y recorro los datos

const searchSeriesHandler = () => {
    const elementInputValue = elementInput.value.toLowerCase();
    fetch(urlBase + elementInputValue)
    .then(response => response.json())
    .then(data => displaySeries(data))
        
}


// pinto los elementos 

function displaySeries (data)  {
for (let item of data) {
    if (item.show.image === null ){
        listResultContain += `<li class="serie-list""><span  class="serie--name">${item.show.name}</span><img class="serie--image" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"></li>`;

    } else {
        listResultContain +=`<li class="serie-list"><span class="serie--name">${item.show.name}</span><img class="serie--image" src="${item.show.image.medium}"></li>`
    }
    
}
    elementListResult.innerHTML = listResultContain;
    createFavorites()   
}


// FAVORITOS

//  1.recorro los lis pintados en el Dom 
function createFavorites () {
    const list = document.querySelectorAll('.serie-list');
        for (let item of list) {
            item.addEventListener('click', showFav)
        }
    }



// 2.selecciono y guardo en el localstorage

function showFav () {
 const elementFavLi = event.currentTarget;
 const elementFavSpan = elementFavLi.querySelector('.serie--name')
 const elementFavImg = elementFavLi.querySelector('.serie--image')
 elementFavLi.classList.toggle('show-background')

 if (elementFavLi.classList.contains('show-background')) {
    const favorites = {
        "name": elementFavSpan.innerHTML,
        "image": elementFavImg.src,
    } 
    favoritesObj.push(favorites);
    localStorage.setItem('myFavorites',JSON.stringify(favoritesObj));
    createFavorites()
 }
 loadFav()
    
}
// recojo datos del localstorage
function loadFav() {
    const mylocalStorage = localStorage.getItem('myFavorites')
    if(mylocalStorage !== null) {
        favoritesObj = JSON.parse(mylocalStorage);;
        paintFav(favoritesObj)

    }
    
}

//recorro datos guardados en el local storage y pinto en el DOM 

function paintFav (arr) {
    const elementListFav = document.querySelector('#js-fav-list');
    for (let obj of arr) {
        listResultFavorites += `<span>${obj.name}</span><img src=${obj.image}>`
    }

    elementListFav.innerHTML = listResultFavorites;
}





// evitar recargar la página
function submitHandler (event) { 
    event.preventDefault()
    searchSeriesHandler()
   
} 

elementForm.addEventListener('submit', submitHandler)
elementButton.addEventListener('click', searchSeriesHandler)
// window.addEventListener('load', loadFav)

