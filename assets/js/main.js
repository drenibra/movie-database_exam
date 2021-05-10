$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        console.log('test');
        let searchText = $('#searchText').val();
        let type = $('#type').val();
        let year = $('#year').val();
        let genre = $('#genre').val();
        let ratings = $('#ratings').val();
        getMovies(searchText, type, year, genre, ratings);
        e.preventDefault();
    });    
});

const apiKey = '66e34c42';
let output;

function getMovies(searchText, type, year, genre, ratings) {
    var url = `http://www.omdbapi.com/?apikey=${apiKey}&y=${year}`;
    axios.get(`${url}&s=${searchText}&type=${type}`)
    .then((response) => {
        console.log(response);
        let movies = response.data.Search;
        output = '';
        $.each(movies, (index, movie) => {
            var url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
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

function renderOutput(poster, title, type, year, imdbID) {
    output += `
    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
        <div class="card mb-5">
            <img class="card-img-top" src="${poster}" alt="${title}-Poster">
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
    var url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;
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
                        <a class="btn btn-primary" href="http://imdb.com/title/${movie.imdbID}" target="_blank">View IMDB</a>
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