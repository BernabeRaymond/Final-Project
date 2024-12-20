import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Lists.css';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);


  const getMovies = () => {
    axios
      .get('/movies', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => console.error('Error fetching movies:', error));
  };

  useEffect(() => {
    getMovies();  
  }, []);

  // Delete a movie
  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => {
          setLists((prev) => prev.filter((movie) => movie.id !== id));
        })
        .catch((error) => console.error('Error deleting movie:', error));
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          type="button"
          onClick={() => navigate('/main/movies/form')}
        >
          Create New
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/main/movies/form/${movie.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
