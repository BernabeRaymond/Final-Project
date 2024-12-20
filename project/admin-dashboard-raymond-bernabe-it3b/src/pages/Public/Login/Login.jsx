  import { useState, useRef, useCallback, useEffect } from 'react';
  import './Login.css';
  import { useNavigate, Link } from 'react-router-dom';
  import { useDebounce } from '../../../utils/hooks/useDebounce';
  import axios from 'axios';

  function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isFieldsDirty, setIsFieldsDirty] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [debounceTriggered, setDebounceTriggered] = useState(false);
    const [status, setStatus] = useState('idle');
    const navigate = useNavigate();

    const inputRefs = {
      email: useRef(),
      password: useRef(),
    };

    const debouncedCredentials = useDebounce(credentials, 2000);

    const toggleShowPassword = useCallback(() => {
      setIsShowPassword((prev) => !prev);
    }, []);

    const handleInputChange = (event, field) => {
      setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
      setIsFieldsDirty(true);
      setDebounceTriggered(false);
    };

    const handleLogin = async () => {
      const { email, password } = credentials;
      const data = { email, password };

      setStatus('loading');

      try {
        const response = await axios.post('/admin/login', data, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });

        localStorage.setItem('accessToken', response.data.access_token);
        navigate('/main/movies');
        setStatus('idle');
      } catch (error) {
        console.error(error);
        setStatus('idle');
      }
    };

    useEffect(() => {
      setDebounceTriggered(true);
    }, [debouncedCredentials]);

    return (
      <div className='Login'>
        <div className='main-container'>
          <h3>Login</h3>
          <form>
            <div className='form-container'>
              <div>
                <div className='form-group'>
                  <label>E-mail:</label>
                  <input
                    type='text'
                    name='email'
                    ref={inputRefs.email}
                    value={credentials.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                </div>
                {debounceTriggered && isFieldsDirty && !credentials.email && (
                  <span className='errors'>This field is required</span>
                )}
              </div>
              <div>
                <div className='form-group'>
                  <label>Password:</label>
                  <input
                    type={isShowPassword ? 'text' : 'password'}
                    name='password'
                    ref={inputRefs.password}
                    value={credentials.password}
                    onChange={(e) => handleInputChange(e, 'password')}
                  />
                </div>
                {debounceTriggered && isFieldsDirty && !credentials.password && (
                  <span className='errors'>This field is required</span>
                )}
              </div>
              <div className='show-password' onClick={toggleShowPassword}>
                {isShowPassword ? 'Hide' : 'Show'} Password
              </div>

              <div className='submit-container'>
                <button
                  type='button'
                  disabled={status === 'loading'}
                  onClick={() => {
                    if (status === 'loading') return;

                    if (credentials.email && credentials.password) {
                      handleLogin();
                    } else {
                      setIsFieldsDirty(true);
                      if (!credentials.email) inputRefs.email.current.focus();
                      if (!credentials.password) inputRefs.password.current.focus();
                    }
                  }}
                >
                  {status === 'idle' ? 'Login' : 'Loading'}
                </button>
              </div>

              <div className='register-container'>
                <Link to='/register'>
                  <small>Register</small>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default Login;
