import React, {useRef} from 'react';
import {loginUser, useAuthState, useAuthDispatch} from '../../Context';
import {NavLink} from 'react-router-dom';

function Login(props) {
  const emailInput = useRef();
  const passwordInput = useRef();

  const dispatch = useAuthDispatch();

  const {loading, errorMessage} = useAuthState();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    try {
      let response = loginUser(dispatch, {email, password});
      if (!response.user) return;
      props.history.push('/dashboard');
    } catch (error) {}
  };

  return (
    <>
      {loading ? (
        <div className="lds-ring text-center">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          ) : (
            ''
          )}

          <form
            onSubmit={handleLogin}
            className="login-form p-2 pt-5"
            autoComplete="off"
          >
            <div className="login-form_container">
              <h3 className="text-center mb-5">Account Login</h3>
              <label htmlFor="username">Email</label>
              <input
                type="email"
                autoComplete="new-password"
                placeholder="Email"
                name="username"
                required
                ref={emailInput}
              />
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="text"
                placeholder="Password"
                name="password"
                required
                ref={passwordInput}
              />
              <br />
              <div className="text-center">
                <button className="btn btn-danger" type="submit">
                  Log In
                </button>
                <NavLink
                  to="/register"
                  className="btn btn-danger"
                  type="submit"
                >
                  Register
                </NavLink>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default Login;
