import Notiflix from 'notiflix';
const axios = require('axios').default;


const pixabayKey = '36594105-8544a69bb4c5d0c0362bb11bf';
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const moreBtnEl = document.querySelector('.load-more');
const PER_PAGE = 4;
let pageParams = 1;
let searchVal;

formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    galleryEl.innerHTML = '';
    moreBtnEl.style.visibility = 'hidden';
    
    searchVal = event.target.searchQuery.value;
    //console.log('lol',event.target.searchQuery.value);

    if (searchVal == "") {
        Notiflix.Report.warning("ACHTUNG!!!",'Imput can not be empty!!!');
        return 
    }
    
    axios({
        method: 'get',
        url: 'https://pixabay.com/api/',
        params: {
            key: pixabayKey,
            q: searchVal,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: PER_PAGE,
            page: pageParams
        },   
    })
        .then(function (response) {
            if (response.data.hits.length == 0) { 
                
                Notiflix.Report.info('What a pity...', 'Sorry, there are no images matching your search query. Please try again')
                return false
            }
            console.log('lol1',response.data.hits);
            
            response.data.hits.forEach(el => {
                galleryEl.insertAdjacentHTML(

                    'beforeEnd',
                    `<div class="photo-card">
                    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
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
            if (response.data.totalHits > PER_PAGE) { 
                moreBtnEl.style.visibility = 'visible';
            }

            
            console.log(response.data.hits.length);
            console.log(response.data.totalHits);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
})


moreBtnEl.addEventListener('click', function (event) {



    axios({
        method: 'get',
        url: 'https://pixabay.com/api/',
        params: {
            key: pixabayKey,
            q: searchVal,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: PER_PAGE,
            page: pageParams
        },   
    })

    
    .then(function (response) {
        
        response.data.hits.forEach(el => {
            galleryEl.insertAdjacentHTML(

                'beforeEnd',
                `<div class="photo-card">
                <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
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

        if ( pageParams == Math.ceil(response.data.totalHits / PER_PAGE) ) { 
            moreBtnEl.style.visibility = 'hidden';
        }
        console.log('Im  on page#: ', pageParams);
    })
    .catch(function (error) {
        console.log(error);
    })
})

// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// // Change code below this line

// galleryItems.forEach(el => {
// ulEl.insertAdjacentHTML(
//     'beforeEnd',
//     `<li class="gallery__item">
//         <a class="gallery__link" href="${el.original}">
//         <img
//             class="gallery__image"
//             src="${el.preview}"
//             alt="${el.description}"
            
//         />
//         </a>
//     </li>`
// );
// });

// const lightbox = new SimpleLightbox('.gallery a', {
// captionsData: 'alt',
// captionDelay: 250,
// });
