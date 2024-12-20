import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Form.css";


const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    popularity: "",
    releaseDate: "",
    voteAverage: "",
    videos: [],
    cast: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);

  const { movieId } = useParams();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    setError("");
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setSearchedMovieList([]);

    axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`, {
      headers: {
        Accept: "application/json",
        Authorization:  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGY1MTAzMGM0ZDViYjQxNDQ5MmFmMDAwYjE0OWY3NCIsIm5iZiI6MTczMzI4MzU4Ny42NzcsInN1YiI6IjY3NGZjZjAzY2IxZTEyMGNjYjVkYzNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.10Q9xIm2LkFQcR64kN1CyIym49x5fejq-EKIeJMpd34',
      },
    })
      .then((response) => {
        if (response.data.results.length === 0) {
          setError("No movies found matching your search");
        } else {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(() => {
        setError("Unable to search movies at this time. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      handleSearch();
    }
  }, [currentPage, handleSearch]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      videos: [],
      cast: [],
    });
    setError("");
  
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGY1MTAzMGM0ZDViYjQxNDQ5MmFmMDAwYjE0OWY3NCIsIm5iZiI6MTczMzI4MzU4Ny42NzcsInN1YiI6IjY3NGZjZjAzY2IxZTEyMGNjYjVkYzNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.10Q9xIm2LkFQcR64kN1CyIym49x5fejq-EKIeJMpd34',
      },
    })
      .then(response => {
        
        const trailers = response.data.results.filter(video => video.type === "Trailer");
        if (trailers.length > 0) {
          setVideos(trailers);
          setFormData(prevData => ({
            ...prevData,
            videos: trailers,
          }));
        } else {
          setVideos([]);
        }
      })
      .catch(() => {
        setError("Unable to load videos. Please try again later.");
      });
  
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGY1MTAzMGM0ZDViYjQxNDQ5MmFmMDAwYjE0OWY3NCIsIm5iZiI6MTczMzI4MzU4Ny42NzcsInN1YiI6IjY3NGZjZjAzY2IxZTEyMGNjYjVkYzNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.10Q9xIm2LkFQcR64kN1CyIym49x5fejq-EKIeJMpd34',
      },
    })
      .then(response => {
        setCast(response.data.cast);
        setFormData(prevData => ({
          ...prevData,
          cast: response.data.cast,
        }));
      })
      .catch(() => {
        setError("Unable to load cast information. Please try again later.");
      });

    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGY1MTAzMGM0ZDViYjQxNDQ5MmFmMDAwYjE0OWY3NCIsIm5iZiI6MTczMzI4MzU4Ny42NzcsInN1YiI6IjY3NGZjZjAzY2IxZTEyMGNjYjVkYzNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.10Q9xIm2LkFQcR64kN1CyIym49x5fejq-EKIeJMpd34',
      },
    })
      .then(response => {
        setCast(response.data.cast);
        setFormData(prevData => ({
          ...prevData,
          cast: response.data.cast,
        }));
      })
      .catch(() => {
        setError("Unable to load cast information. Please try again later.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title) errors.push("Title is required");
    if (!formData.overview) errors.push("Overview is required");
    if (!formData.releaseDate) errors.push("Release date is required");
    if (!formData.popularity) errors.push("Popularity is required");
    if (!formData.voteAverage) errors.push("Vote average is required");
    if (!selectedMovie) errors.push("Please select a movie from search results");
  

    if (movieId && !formData.title.trim()) errors.push("Title is required for editing");
    if (movieId && !formData.overview.trim()) errors.push("Overview is required for editing");
    if (movieId && !formData.releaseDate.trim()) errors.push("Release date is required for editing");
    if (movieId && formData.popularity === "") errors.push("Popularity is required for editing");
    if (movieId && formData.voteAverage === "") errors.push("Vote average is required for editing");
  
    return errors;
  };
  
  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to perform this action");
      setIsLoading(false);
      return;
    }
  
    const data = {
      tmdbId: selectedMovie.id,
      title: formData.title,
      overview: formData.overview,
      popularity: parseFloat(formData.popularity),
      releaseDate: formData.releaseDate,
      voteAverage: parseFloat(formData.voteAverage),
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
      videos: formData.videos,
      cast: formData.cast,
    };
  
    try {
      await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate("/main/movies");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unable to save the movie. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");

      axios.get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          setSelectedMovie({
            id: movieData.tmdbId,
            original_title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            poster_path: movieData.posterPath.replace("https://image.tmdb.org/t/p/original/", ""),
            release_date: movieData.releaseDate,
            vote_average: movieData.voteAverage,
          });
          setFormData({
            title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            releaseDate: movieData.releaseDate,
            voteAverage: movieData.voteAverage,
            videos: movieData.videos || [],
            cast: movieData.cast || [],
          });
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId !== undefined ? "Edit" : "Create"} Movie</h1>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}

      {movieId === undefined && (
        <>
          <div className="search-container">
            <label htmlFor="movie-search" className="search-label">Search Movie:</label>
            <div className="search-input-container">
              <input
                id="movie-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter movie title..."
                disabled={isLoading}
                className="search-input"
              />
              <button
                className="search-button"
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  handleSearch();
                }}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
          <div className="searched-movie">
  <ul className="movie-list">
    {searchedMovieList.map((movie) => (
      <li
        key={movie.id}
        onClick={() => handleSelectMovie(movie)}
        className={`movie-item ${selectedMovie?.id === movie.id ? "selected" : ""}`}
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <span className="movie-title">{movie.title}</span>
      </li>
    ))}
  </ul>
</div>
        
          {totalPages > 1 && (
            <div className="pagination-container">
              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedMovie && (
        <div className="movie-form">
          <h2>Movie Details</h2>
          <div className="form-fields">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter movie title"
            />
            <label htmlFor="overview">Overview:</label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Enter movie overview"
            />
            <label htmlFor="releaseDate">Release Date:</label>
            <input
              id="releaseDate"
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
            />
            <label htmlFor="popularity">Popularity:</label>
            <input
              id="popularity"
              type="number"
              name="popularity"
              value={formData.popularity}
              onChange={handleInputChange}
              placeholder="Enter movie popularity"
            />
            <label htmlFor="voteAverage">Vote Average:</label>
            <input
              id="voteAverage"
              type="number"
              name="voteAverage"
              value={formData.voteAverage}
              onChange={handleInputChange}
              placeholder="Enter movie vote average"
            />
          </div>

          <div className="video-container">
            <h3>Trailer:</h3>
            {videos.length > 0 && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videos[0].key}`}
                title={selectedMovie.title + " Trailer"}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="cast-container">
            <h3>Cast:</h3>
            {cast.length > 0 ? (
              <div className="cast-grid">
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      className="cast-image"
                    />
                    <p>{actor.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No cast information available</p>
            )}
          </div>

          <button className="save-button" onClick={handleSave}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
