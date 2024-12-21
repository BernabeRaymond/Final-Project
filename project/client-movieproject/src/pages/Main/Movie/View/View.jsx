import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
  }, [movieId]);

  return (
    <>
      {movie && (
        <>
          <div>
            <div className="banner">
              <h1>{movie.title}</h1>
            </div>
            <h3>{movie.overview}</h3>
          </div>

          {/* Cast Section */}
          {movie.casts && movie.casts.length > 0 && (
            <div>
              <h1>Cast & Crew</h1>
              <div className="cast-grid">
                {movie.casts.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                          : 'https://via.placeholder.com/150'
                      }
                      alt={actor.name}
                      className="cast-image"
                    />
                    <p>{actor.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Section */}
          {movie.videos && movie.videos.length > 0 && (
            <div>
              <h1>Videos</h1>
              <div className="video-container">
                {movie.videos.map((video) => (
                  <iframe
                    key={video.key}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          )}

          {/* Photos Section */}
          {movie.photos && movie.photos.length > 0 && (
            <div>
              <h1>Photos</h1>
              <div className="photo-grid">
                {movie.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="photo-image"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default View;
