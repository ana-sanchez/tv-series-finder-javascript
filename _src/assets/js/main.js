'use strict';

// import { format } from "util";




const elementForm = document.querySelector('#js-form');
const elementButton = document.querySelector('#js-button');
const elementInput = document.querySelector('#js-input');
const elemenListFav = document.querySelector('#js-fav-list');
const elementListResult = document.querySelector('#js-results-list');
const elementReset = document.querySelector('#js-reset')
const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const elementListFav = document.querySelector('#js-fav-list');
const elementItemReset = document.querySelector('#js-reset-item')
let listResultContain = '';

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
        listResultContain += `<li class="serie-list" data="${item.show.id}"><span  class="serie--name">${item.show.name}</span><img class="serie--image" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"></li>`;

    } else {
        listResultContain +=`<li class="serie-list" data="${item.show.id}"><span class="serie--name">${item.show.name}</span><img class="serie--image" src="${item.show.image.medium}"></li>`
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
    paintFav(favoritesObj)
   
   
    
    } else if (!elementFavLi.classList.contains('show-background')) {
        
        favoritesObj = JSON.parse(localStorage.getItem('myFavorites'));
        const localIndex = findIndex(elementFavSpan.innerHTML, favoritesObj);
        favoritesObj.splice(localIndex, 1);
        localStorage.setItem('myFavorites',JSON.stringify(favoritesObj));
        paintFav(favoritesObj)
       
        
    }
   

    

}

// buscador indice array
function findIndex(name, array){
    for (let i=0; i < array.length; i++) {
        if (array[i].name === name) {
            return array.indexOf(array[i]);
        }
    }
}



// recojo datos del localstorage
function loadFav() {
    const mylocalStorage = localStorage.getItem('myFavorites')
    if(mylocalStorage !== null) {
        favoritesObj = JSON.parse(mylocalStorage);
        paintFav(favoritesObj)
        
    }
    
}

//recorro datos guardados en el local storage y pinto en el DOM 

function paintFav (arr) {
    let listResultFavorites= '';
    for (let obj of arr) {
        listResultFavorites += `<div class="fav" id="js-fav"><li class="fav-list"><img src=${obj.image} class="fav__image"><span class="fav__title">${obj.name}</span><button type="button" id="js-reset-item" class="fav__remove">X</button></li></div>`
    }
    elementListFav.innerHTML = listResultFavorites;
    resetHandlerFav()
    
  

}

//boton reset, borra del localstorage + div + quita clase   

const resetFav = () => {
    const mylocalStorage = localStorage.getItem('myFavorites')
    favoritesObj = JSON.parse(mylocalStorage);
    const itemResult = document.querySelector('.serie-list')
    if (elemenListFav.innerHTML !== '' && mylocalStorage !== null ){
        elemenListFav.innerHTML = '';
        localStorage.removeItem('myFavorites')
        itemResult.classList.remove('show-background');
    }
}

// selecc
function resetHandlerFav() {
    const list = document.querySelectorAll('.fav__remove');
        for (let item of list) {
            item.addEventListener('click', resetItem)
        }
      
    }


const resetItem = (event) => {
  const elementFav = event.currentTarget.closest('li');
  elementFav.classList.add('hidden')
}



// evitar recargar la página
function submitHandler (event) { 
    event.preventDefault()
    searchSeriesHandler()
   
} 

elementForm.addEventListener('submit', submitHandler)
elementButton.addEventListener('click', searchSeriesHandler)
window.addEventListener('load', loadFav);
elementReset.addEventListener('click', resetFav);


