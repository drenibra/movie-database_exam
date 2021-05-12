$(document).ready(() => {
    getPopularMovies();
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        let type = $('#type').val();
        let year = $('#year').val();
        let genre = $('#genre').val();
        let ratings = $('#ratings').val();
        getMovies(searchText, type, year, genre, ratings);
        e.preventDefault();
    });
});

const apiKey = '66e34c42',
    popularMoviesApi = '4e4c856e030c60ca3dc206cecae8f96f';
let output;
let popularMoviesOutput;

function getMovies(searchText, type, year, genre, ratings) {
    var url = `https://www.omdbapi.com/?apikey=${apiKey}&y=${year}`;
    axios.get(`${url}&s=${searchText}&type=${type}`)
    .then((response) => {
        let movies = response.data.Search;
        output = '';
        $.each(movies, (index, movie) => {
            var url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            axios.get(`${url}`)
                .then((response) => {
                    let movie = response.data;
                    let movieRating = (movie.Ratings[0].Value).split('/')[0];
                    if (movie.Genre.toLowerCase().includes(genre.toLowerCase()) && (ratings <= movieRating || ratings == '')) {
                        renderOutput(movie.Poster, movie.Title, movie.Type, movie.Year, movie.imdbID);
                    }
                })
        });

        $('#movies').html(output);
    })
    .catch((err) => {
        console.log((err));
    })
}

function getPopularMovies() {
    var url = `https://api.themoviedb.org/3/movie/popular?api_key=${popularMoviesApi}&language=en-US&page=1`;
    axios.get(url)
    .then((response) => {
        let count = 0;
        let popularMovies = response.data.results;
        popularMovies.forEach((movie) => {
            count++;
            let poster = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
            if (count <= 20) {
                popularMoviesOutput += `
                <div class="item">
                <img src="${poster}" loading="lazy" alt="${movie.original_title}-poster">
                </div>
                `;
            }

        })
        $('#popularMoviesOutput').html(popularMoviesOutput);
        var replace = $('#popularMoviesOutput').html().replace('undefined', '');
        $('#popularMoviesOutput').html(replace);
        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            autoplay: true,
            autoplayTimeout:4000,
            lazyLoad: true,
            autoplayHoverPause:true,
            nav:true,
            responsive:{
                0:{
                    items:2
                },
                767:{
                    items:3
                },
                1000:{
                    items:5
                }
            }
        })
    })
}

function renderOutput(poster, title, type, year, imdbID) {
    output += `
    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
        <div class="card mb-5">
            <a href="#" onclick="movieSelected('${imdbID}')"><img class="card-img-top" src="${poster}" alt="${title}-Poster"></a>
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <div class="d-flex">
                    <p class="card-text">${capitalize(type)}</p>
                    <span class="px-2">•</span>
                    <p class="card-text">Released: ${year}</p>
                </div>
                <a onclick="movieSelected('${imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
        </div>
    </div>`;
    $('#movies').html(output);
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}  


function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    let movieId  = sessionStorage.getItem('movieId');
    var url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;
    axios.get(`${url}`)
        .then((response) => {
            console.log(response);
            let movie = response.data;

            let output = `
            <div class="container">
                <div class="row">
                    <div class="col-lg-4">
                        <img src="${movie.Poster}" alt="${movie.Title}-Poster" class="thumbnail">
                        </div>
                    <div class="col-lg-8">
                        <h2>${movie.Title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                            <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                            <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                            <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                            <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                            <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="well">
                        <h3>Plot</h3>
                        <p>${movie.Plot}</p>
                        <hr>
                        <a class="btn btn-primary" href="https://imdb.com/title/${movie.imdbID}" target="_blank">View IMDB</a>
                        <a class="btn btn-default" href="index.html">Go Back to Search</a>
                    </div>
                </div>
            </div>
            `;

            $('#movie').html(output);
        })
        .catch((err) => {
            console.log((err));
        })
}