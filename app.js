$(document).ready(function () {

    // TMDB API SETTINGS

    const API_KEY = "YOUR_TMDB_API_KEY";

    const BASE_URL = "https://api.themoviedb.org/3";

    const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


    // SPA NAVIGATION

    function showView(viewID) {

        // Hide all SPA sections
        $(".app-view").hide();

        // Show the selected section
        $(viewID).show();

        // Move focus to the heading for accessibility
        $(viewID)
            .find("h2")
            .first()
            .attr("tabindex", "-1")
            .focus();
    }


    // Navigation buttons

    $("#nav-home").click(function () {
        showView("#home-view");
        loadPopularMovies();
    });

    $("#nav-search").click(function () {
        showView("#search-view");
    });

    $("#nav-genres").click(function () {
        showView("#genre-view");
    });

    $("#nav-favorites").click(function () {
        showView("#favorites-view");
        displayFavorites();
    });


    // LOADING MESSAGE

    function showLoading(elementID) {

        $(elementID).html(
            "<p class='loading-message'>Loading...</p>"
        );
    }


    // ERROR MESSAGE

    function showError(message, elementID) {

        $(elementID).html(
            "<p class='error-message'>" +
            message +
            "</p>"
        );
    }


    // CREATE MOVIE CARD

    function createMovieCard(movie) {

        // Use a placeholder if poster is missing
        let poster;

        if (movie.poster_path) {

            poster = IMAGE_URL + movie.poster_path;

        } else {

            poster = "images/placeholder-poster.png";
        }


        // Handle missing release date
        let releaseDate = "Release date unavailable";

        if (movie.release_date) {
            releaseDate = movie.release_date;
        }


        // Build movie card
        let movieCard = `
            <article class="movie-card">

                <img
                    src="${poster}"
                    alt="Poster for ${movie.title}">

                <h3>${movie.title}</h3>

                <p>
                    Release Date:
                    ${releaseDate}
                </p>

                <p>
                    Rating:
                    ${movie.vote_average}
                </p>

                <button
                    class="details-button"
                    data-id="${movie.id}">
                    View Details
                </button>

                <button
                    class="favorite-button"
                    data-id="${movie.id}"
                    data-title="${movie.title}"
                    data-poster="${movie.poster_path || ""}"
                    data-release="${movie.release_date || ""}"
                    data-rating="${movie.vote_average}">
                    Add to Favorites
                </button>

            </article>
        `;

        return movieCard;
    }


    // DISPLAY MOVIE RESULTS

    function displayMovies(movies, elementID) {

        // Clear previous results
        $(elementID).empty();

        // Check for empty results
        if (!movies || movies.length === 0) {

            showError(
                "No movies were found.",
                elementID
            );

            return;
        }


        // Loop through movies
        for (let i = 0; i < movies.length; i++) {

            let movieCard =
                createMovieCard(movies[i]);

            $(elementID).append(movieCard);
        }
    }


    // POPULAR MOVIES

    function loadPopularMovies() {

        showLoading("#popular-results");

        $.ajax({

            url:
                BASE_URL +
                "/movie/popular",

            method: "GET",

            data: {
                api_key: API_KEY,
                language: "en-US",
                page: 1
            },

            success: function (data) {

                displayMovies(
                    data.results,
                    "#popular-results"
                );
            },

            error: function () {

                showError(
                    "Unable to load popular movies.",
                    "#popular-results"
                );
            }
        });
    }


    // SEARCH MOVIES

    function searchMovies(searchTerm) {

        // Remove spaces from beginning/end
        searchTerm = searchTerm.trim();


        // Validate search
        if (searchTerm === "") {

            showError(
                "Please enter a movie title.",
                "#search-results"
            );

            return;
        }


        showLoading("#search-results");


        $.ajax({

            url:
                BASE_URL +
                "/search/movie",

            method: "GET",

            data: {
                api_key: API_KEY,
                query: searchTerm,
                language: "en-US",
                page: 1
            },

            success: function (data) {

                displayMovies(
                    data.results,
                    "#search-results"
                );
            },

            error: function () {

                showError(
                    "Unable to search for movies.",
                    "#search-results"
                );
            }
        });
    }


    // Search form event

    $("#search-form").submit(function (event) {

        // Prevent page reload
        event.preventDefault();

        let searchTerm =
            $("#search-box").val();

        searchMovies(searchTerm);
    });


    // LOAD GENRES

    function loadGenres() {

        $.ajax({

            url:
                BASE_URL +
                "/genre/movie/list",

            method: "GET",

            data: {
                api_key: API_KEY,
                language: "en-US"
            },

            success: function (data) {

                $("#genre-select").empty();

                $("#genre-select").append(
                    "<option value=''>Choose a genre</option>"
                );


                for (
                    let i = 0;
                    i < data.genres.length;
                    i++
                ) {

                    $("#genre-select").append(
                        "<option value='" +
                        data.genres[i].id +
                        "'>" +
                        data.genres[i].name +
                        "</option>"
                    );
                }
            },

            error: function () {

                showError(
                    "Unable to load genres.",
                    "#genre-results"
                );
            }
        });
    }


    // LOAD MOVIES BY GENRE

    function loadMoviesByGenre(genreID) {

        if (genreID === "") {

            $("#genre-results").empty();

            return;
        }


        showLoading("#genre-results");


        $.ajax({

            url:
                BASE_URL +
                "/discover/movie",

            method: "GET",

            data: {
                api_key: API_KEY,
                with_genres: genreID,
                language: "en-US",
                page: 1
            },

            success: function (data) {

                displayMovies(
                    data.results,
                    "#genre-results"
                );
            },

            error: function () {

                showError(
                    "Unable to load movies for this genre.",
                    "#genre-results"
                );
            }
        });
    }


    // Genre dropdown event

    $("#genre-select").change(function () {

        let genreID =
            $(this).val();

        loadMoviesByGenre(genreID);
    });


    // MOVIE DETAILS

    function showMovieDetails(movieID) {

        showView("#details-view");

        showLoading("#movie-details");


        $.ajax({

            url:
                BASE_URL +
                "/movie/" +
                movieID,

            method: "GET",

            data: {
                api_key: API_KEY,
                language: "en-US"
            },

            success: function (movie) {

                let poster;

                if (movie.poster_path) {

                    poster =
                        IMAGE_URL +
                        movie.poster_path;

                } else {

                    poster =
                        "images/placeholder-poster.png";
                }


                // Create genre text
                let genres = "";

                if (movie.genres) {

                    for (
                        let i = 0;
                        i < movie.genres.length;
                        i++
                    ) {

                        genres +=
                            movie.genres[i].name;

                        if (
                            i <
                            movie.genres.length - 1
                        ) {

                            genres += ", ";
                        }
                    }
                }


                let detailsHTML = `
                    <div class="movie-details">

                        <img
                            src="${poster}"
                            alt="Poster for ${movie.title}">

                        <h3>${movie.title}</h3>

                        <p>
                            <strong>
                            Release Date:
                            </strong>

                            ${movie.release_date || "Unavailable"}
                        </p>

                        <p>
                            <strong>
                            Rating:
                            </strong>

                            ${movie.vote_average}
                        </p>

                        <p>
                            <strong>
                            Runtime:
                            </strong>

                            ${movie.runtime || "Unavailable"}
                            minutes
                        </p>

                        <p>
                            <strong>
                            Genres:
                            </strong>

                            ${genres || "Unavailable"}
                        </p>

                        <h4>Overview</h4>

                        <p>
                            ${movie.overview || "No overview available."}
                        </p>

                    </div>
                `;


                $("#movie-details").html(
                    detailsHTML
                );
            },

            error: function () {

                showError(
                    "Unable to load movie details.",
                    "#movie-details"
                );
            }
        });
    }


    // Details button event
    // .on() is used because movie cards are added dynamically

    $(document).on(
        "click",
        ".details-button",
        function () {

            let movieID =
                $(this).data("id");

            showMovieDetails(movieID);
        }
    );


    // FAVORITES

    function getFavorites() {

        let favorites =
            localStorage.getItem(
                "movieFavorites"
            );


        if (favorites) {

            return JSON.parse(favorites);

        } else {

            return [];
        }
    }


    // =========================================
    // ADD FAVORITE
    // =========================================

    function addFavorite(movie) {

        let favorites =
            getFavorites();


        // Check for duplicate
        let alreadySaved = false;

        for (
            let i = 0;
            i < favorites.length;
            i++
        ) {

            if (
                favorites[i].id === movie.id
            ) {

                alreadySaved = true;
            }
        }


        if (!alreadySaved) {

            favorites.push(movie);

            localStorage.setItem(
                "movieFavorites",
                JSON.stringify(favorites)
            );

            alert(
                movie.title +
                " was added to favorites."
            );

        } else {

            alert(
                movie.title +
                " is already in favorites."
            );
        }
    }


    // Favorite button event

    $(document).on(
        "click",
        ".favorite-button",
        function () {

            let movie = {

                id:
                    $(this).data("id"),

                title:
                    $(this).data("title"),

                poster_path:
                    $(this).data("poster"),

                release_date:
                    $(this).data("release"),

                vote_average:
                    $(this).data("rating")
            };


            addFavorite(movie);
        }
    );


    // DISPLAY FAVORITES

    function displayFavorites() {

        let favorites =
            getFavorites();


        $("#favorites-results").empty();


        if (favorites.length === 0) {

            $("#favorites-results").html(
                "<p>You have not saved any favorites yet.</p>"
            );

            return;
        }


        for (
            let i = 0;
            i < favorites.length;
            i++
        ) {

            let movie =
                favorites[i];


            let poster;

            if (movie.poster_path) {

                poster =
                    IMAGE_URL +
                    movie.poster_path;

            } else {

                poster =
                    "images/placeholder-poster.png";
            }


            let favoriteHTML = `
                <article class="movie-card">

                    <img
                        src="${poster}"
                        alt="Poster for ${movie.title}">

                    <h3>
                        ${movie.title}
                    </h3>

                    <p>
                        Release Date:
                        ${movie.release_date || "Unavailable"}
                    </p>

                    <button
                        class="details-button"
                        data-id="${movie.id}">
                        View Details
                    </button>

                    <button
                        class="remove-favorite"
                        data-id="${movie.id}">
                        Remove Favorite
                    </button>

                </article>
            `;


            $("#favorites-results").append(
                favoriteHTML
            );
        }
    }


    // REMOVE FAVORITE

    function removeFavorite(movieID) {

        let favorites =
            getFavorites();


        let updatedFavorites = [];


        for (
            let i = 0;
            i < favorites.length;
            i++
        ) {

            if (
                favorites[i].id != movieID
            ) {

                updatedFavorites.push(
                    favorites[i]
                );
            }
        }


        localStorage.setItem(
            "movieFavorites",
            JSON.stringify(updatedFavorites)
        );


        displayFavorites();
    }


    // Remove favorite event

    $(document).on(
        "click",
        ".remove-favorite",
        function () {

            let movieID =
                $(this).data("id");

            removeFavorite(movieID);
        }
    );


    // BACK BUTTON

    $("#back-button").click(function () {

        showView("#home-view");
    });


    // INITIAL PAGE LOAD

    loadGenres();

    loadPopularMovies();

});
