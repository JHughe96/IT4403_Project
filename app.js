$(document).ready(function () {

    // =========================
    // SPA NAVIGATION
    // =========================

    function showView(viewID) {

        $(".app-view").hide();

        $(viewID).show();

        // Move keyboard focus to the new section heading
        $(viewID).find("h2").first().attr("tabindex", "-1").focus();

    }


    $("#nav-home").click(function () {
        showView("#home-view");
    });


    $("#nav-search").click(function () {
        showView("#search-view");
    });


    $("#nav-genres").click(function () {
        showView("#genre-view");
    });


    $("#nav-favorites").click(function () {
        showView("#favorites-view");
    });



    // =========================
    // TMDB API SETTINGS
    // =========================

    // Add API information here later



    // =========================
    // POPULAR MOVIES
    // =========================

    // Person responsible adds code here



    // =========================
    // MOVIE SEARCH
    // =========================

    // Person responsible adds code here



    // =========================
    // GENRE FILTER
    // =========================

    // Person responsible adds code here



    // =========================
    // MOVIE DETAILS
    // =========================

    // Person responsible adds code here



    // =========================
    // FAVORITES / LOCAL STORAGE
    // =========================

    // Person responsible adds code here



    // =========================
    // ERROR HANDLING
    // =========================

    // Shared error handling code



});
