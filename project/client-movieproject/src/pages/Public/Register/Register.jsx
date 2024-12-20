import { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../../util/hooks/useDebounce';

import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();


  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

 
  const userInputDebounce = useDebounce(
    { email, password, confirmPassword, firstName, middleName, lastName, contactNo },
    2000
  );

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const data = { email, password, firstName, middleName, lastName, contactNo };
    setStatus('loading');

    try {
      const response = await axios.post('/admin/register', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      console.log(response);

      
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setContactNo('');
      setSuccessMessage('Registration Successful! Redirecting to Login...');
      setStatus('idle');

   
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Register">
      <div className="main-container">
        <h3>Register</h3>
        <form>
          <div className="register-form-container">
            <div className="register-form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                ref={firstNameRef}
                onChange={(e) => handleOnChange(e, 'firstName')}
              />
              {debounceState && isFieldsDirty && firstName === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="register-form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                onChange={(e) => handleOnChange(e, 'middleName')}
              />
            </div>

            <div className="register-form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                ref={lastNameRef}
                onChange={(e) => handleOnChange(e, 'lastName')}
              />
              {debounceState && isFieldsDirty && lastName === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="register-form-group">
              <label>Contact No:</label>
              <input
                type="text"
                name="contactNo"
                onChange={(e) => handleOnChange(e, 'contactNo')}
              />
            </div>

            <div className="register-form-group">
              <label>E-mail:</label>
              <input
                type="text"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="register-form-group">
              <label>Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                name="password"
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="register-form-group">
              <label>Confirm Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                name="confirmPassword"
                ref={confirmPasswordRef}
                onChange={(e) => handleOnChange(e, 'confirmPassword')}
              />
              {debounceState && isFieldsDirty && confirmPassword === '' && (
                <span className="errors">This field is required</span>
              )}
              {password !== confirmPassword && confirmPassword !== '' && (
                <span className="errors">Passwords do not match</span>
              )}
            </div>

            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={handleRegister}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <div className="login-container">
              <a href="/login">
                <small>Already have an account? Login</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
