import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './modules/data.js';
//import {createMarkup} from './modules/functions.js'


// const pixabayKey = '36594105-8544a69bb4c5d0c0362bb11bf';
// const formEl = document.querySelector('.search-form');
// const galleryEl = document.querySelector('.gallery');
// //const moreBtnEl = document.querySelector('.load-more');
// const PER_PAGE = 4;
// let pageParams = 1;
// let isCanLoad = false;

// let searchVal;

// const lightbox = new SimpleLightbox('.gallery a');

let pageParams = 1;
let isCanLoad = false;
let searchVal;


function createMarkup(imgArr) {
  
  imgArr.forEach(el => {
      refs.galleryEl.insertAdjacentHTML(

          'beforeEnd',
          `<div class="photo-card">

          <a class="photo" href="${el.webformatURL}">
          <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width='480' height='320'/>
          </a>

          <div class="info">
            <p class="info-item">
              <b>Likes: ${el.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${el.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${el.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${el.downloads}</b>
            </p>
          </div>
        </div>`
      );
    });
}

refs.formEl.addEventListener('submit', function (event) {
  
    event.preventDefault();

    refs.galleryEl.innerHTML = '';
    //moreBtnEl.style.visibility = 'hidden';
    
    searchVal = event.target.searchQuery.value;

    if (searchVal == "") {
        Notiflix.Report.warning("ACHTUNG!!!",'Imput can not be empty!!!');
        return 
    }

    pageParams = 1;

    axios({
        method: 'get',
        url: 'https://pixabay.com/api/',
        params: {
            key: refs.pixabayKey,
            q: searchVal,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: refs.PER_PAGE,
            page: pageParams
        },   
    })
        .then(function (response) {
            if (response.data.hits.length == 0) { 
                
                Notiflix.Report.info('What a pity...', 'Sorry, there are no images matching your search query. Please try again')
                return false
            }
            console.log('lol1',response.data.hits);
            console.log('lol1',response);
            
            
            isCanLoad = response.data.totalHits > refs.PER_PAGE ? true : false;
            
            
            createMarkup(response.data.hits);
            
            refs.lightbox.refresh(); // Next Image

            console.log(refs.PER_PAGE);
            console.log(response.data.hits.length);
            console.log(response.data.totalHits);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    });
        // window.addEventListener('scroll', function() {
        //   document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
        // });

window.addEventListener('scroll', function () {
  //console.log('scroll1 window.innerHeight, window.pageYOffset, document.body.offsetHeight', window.innerHeight, window.pageYOffset, document.body.offsetHeight);
 
  if((document.body.offsetHeight-window.innerHeight) <= window.pageYOffset && isCanLoad == true){
    loadMoreImgs();
  }
})

function loadMoreImgs() {
    
  pageParams += 1;

  axios({
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
          key: refs.pixabayKey,
          q: searchVal,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: refs.PER_PAGE,
          page: pageParams
      }  
  })
  .then(function (response) {
      
    createMarkup(response.data.hits);
       
        refs.lightbox.refresh(); // Next Image
       

      if ( pageParams == Math.ceil(response.data.totalHits / refs.PER_PAGE) ) { 

          //moreBtnEl.style.visibility = 'hidden';

          Notiflix.Report.info("We're sorry, but you've reached the end of search results.");
      }
  })
  
  .catch(function (error) {
      console.log(error);
  })
}


/* function test() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.3,
    behavior: "smooth",
  });
  //console.log('call test', document.querySelector(".gallery").firstElementChild.getBoundingClientRect());
} */
