// At the first time running/loading the page this will get executed
window.onload = () => {
  getOriginal();
  getTopRated();
  getTrennding();
};
// To fetch the API
const fetchMovies = (url, dom_element, path_type) => {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      showMovies(data, dom_element, path_type);
    })
    .catch((error) => console.log(error));
};
// Display the movies
const showMovies = (movies, dom_element, path_type) => {
  // Getting the DOM element id or class
  var movieElement = document.querySelector(dom_element);

  // Loop through all the movies

  for (var movie of movies.results) {
    console.log(movie);
    // Creating the image element for each movie
    var imageElement = document.createElement("img");
    // Set the attribute for the image element
    imageElement.setAttribute("data-id", movie.id);
    // Set the image source
    imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;

    imageElement.addEventListener("click", (e) => {
      handleMovieSelection(e);
    });
    // Append the movie to DOM element
    movieElement.appendChild(imageElement);
  }
};
// Original movies url
const getOriginal = () => {
  let url =
    "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url, ".original_movies", "poster_path");
};
// Trending movies url
const getTrennding = () => {
  let url =
    "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
  fetchMovies(url, "#trending", "backdrop_path");
};
// Top rated movies url
const getTopRated = () => {
  let url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
  fetchMovies(url, "#top_rated", "backdrop_path");
};

// fetching the movie details based on the selcted movie id
async function getMovieTrailer(id) {
  var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("something went wrong");
    }
  });
}
// Showing the trailer based on the result

const setTrailer = (trailers) => {
  const iframe = document.getElementById("movieTrailer");
  const movieNotFound = document.querySelector(".movieNotFound");
  if (trailers.length > 0) {
    movieNotFound.classList.add("d-none");
    iframe.classList.remove("d-none");
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
  } else {
    iframe.removeAttribute = "src";
    iframe.classList.add("d-none");
    movieNotFound.classList.remove("d-none");
  }
};

// Getting the movie trailer by calling getMovieTrailer
const handleMovieSelection = (e) => {
  const id = e.target.getAttribute("data-id");
  const iframe = document.getElementById("movieTrailer");
  // here we need the id of the movie
  getMovieTrailer(id).then((data) => {
    const results = data.results;
    const youtubeTrailers = results.filter((result) => {
      if (result.site == "YouTube" && result.type == "Trailer") {
        return true;
      } else {
        return false;
      }
    });
    setTrailer(youtubeTrailers);
  });

  // open modal
  document.getElementById("trailerModal").style.display = "block";

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("trailerModal").style.display = "none";
  });
};
