import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';  
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const location = useLocation(); 


  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');  
      }, 1000);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login'); 
    }
  }, [accessToken, navigate]);

 
  const handleNavigateToMovies = () => {
    if (location.pathname !== '/movies') {
      navigate('/movies');  
    }
  };

  return (
    <div className="Main">
      <div className="container">
        <div className="navigation">
          <ul>
            {/* Movies Button */}
            <li>
              <button
                onClick={handleNavigateToMovies}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Movies
              </button>
            </li>

            {/* Log Out Button */}
            {accessToken && (
              <li className="logout">
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Content Section */}
        <div className="outlet">
          <Outlet />  {/* This will render the nested routes */}
        </div>
      </div>
    </div>
  );
}

export default Main;
