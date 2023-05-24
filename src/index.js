import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './modules/data.js';
import { createMarkup } from './modules/functions.js'

let pageParams = 1;
let isCanLoad = false;
let searchVal;

refs.formEl.addEventListener('submit', function (event) {
  
    event.preventDefault();

    refs.galleryEl.innerHTML = '';
    
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
            
            isCanLoad = response.data.totalHits > refs.PER_PAGE ? true : false;
            
            createMarkup(response.data.hits);
            
            refs.lightbox.refresh(); 

        })
        .catch(function (error) {
            console.log(error);
        })
    });

window.addEventListener('scroll', function () {
 
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
       
        refs.lightbox.refresh(); 

      if ( pageParams == Math.ceil(response.data.totalHits / refs.PER_PAGE) ) { 
          Notiflix.Report.info("We're sorry, but you've reached the end of search results.");
      }
  })
  
  .catch(function (error) {
      console.log(error);
  })
}