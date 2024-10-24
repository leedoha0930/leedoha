const API_KEY = 'e5bd5f328991d33c6ba52e64374603ff';
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko&page=1`;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';



const movieList = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const showBookmarksBtn = document.getElementById('showBookmarksBtn');
const movieModal = document.getElementById('movieModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalOverview = document.getElementById('modalOverview');
const modalReleaseDate = document.getElementById('modalReleaseDate');
const modalRating = document.getElementById('modalRating');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const removeBookmarkBtn = document.getElementById('removeBookmarkBtn');
const closeModal = document.querySelector('.close');

let currentMovieId = null;


async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
}

function displayMovies(movies) {
    movieList.innerHTML = ''; 
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        movieCard.innerHTML = `
            <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>평점: ${movie.vote_average}</p>
        `;
        
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieList.appendChild(movieCard);
    });
}


async function showMovieDetails(movieId) {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko`;
    const response = await fetch(movieDetailURL);
    const movie = await response.json();

    currentMovieId = movie.id; 

    modalImage.src = IMAGE_URL + movie.poster_path;
    modalTitle.textContent = movie.title;
    modalOverview.textContent = movie.overview;
    modalReleaseDate.textContent = movie.release_date;
    modalRating.textContent = movie.vote_average;

    movieModal.style.display = 'block';

    updateBookmarkButtons();
}


closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});


window.addEventListener('click', (event) => {
    if (event.target == movieModal) {
        movieModal.style.display = 'none';
    }
});


bookmarkBtn.addEventListener('click', () => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    if (!bookmarks.includes(currentMovieId)) {
        bookmarks.push(currentMovieId);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert('영화가 북마크에 추가되었습니다!');
        updateBookmarkButtons(); 
    } else {
        alert('이미 북마크에 추가된 영화입니다.');
    }
});


removeBookmarkBtn.addEventListener('click', () => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    if (bookmarks.includes(currentMovieId)) {
        bookmarks = bookmarks.filter(id => id !== currentMovieId);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert('영화가 북마크에서 제거되었습니다.');
        updateBookmarkButtons(); 
    } else {
        alert('이 영화는 북마크에 없습니다.');
    }
});

function updateBookmarkButtons() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    if (bookmarks.includes(currentMovieId)) {
        bookmarkBtn.style.display = 'none';
        removeBookmarkBtn.style.display = 'block';
    } else {
        bookmarkBtn.style.display = 'block';
        removeBookmarkBtn.style.display = 'none';
    }
}


showBookmarksBtn.addEventListener('click', () => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    if (bookmarks.length === 0) {
        alert('북마크된 영화가 없습니다.');
        return;
    }

    
    const promises = bookmarks.map(id => {
        const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko`;
        return fetch(movieDetailURL).then(response => response.json());
    });

    Promise.all(promises)
        .then(movies => {
            displayMovies(movies); 
        })
        .catch(error => {
            console.error('북마크된 영화를 불러오는 중 오류가 발생했습니다:', error);
        });
});


searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=ko`;
    
    if (searchTerm) {
        fetchMovies(searchURL);
    } else {
        fetchMovies(API_URL); 
    }
});

fetchMovies(API_URL);








