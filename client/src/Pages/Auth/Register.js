import React, {useRef} from 'react';
import {registerUser, useAuthState, useAuthDispatch} from '../../Context';

function Login(props) {
  const emailInput = useRef();
  const userNameInput = useRef();
  const roleInput = useRef();
  const passwordInput = useRef();

  const dispatch = useAuthDispatch();

  const {loading, errorMessage} = useAuthState();

  const handleLogin = async (e) => {
    e.preventDefault();
    const name = userNameInput.current.value;
    const role = roleInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    try {
      let response = await registerUser(dispatch, {
        email,
        password,
        name,
        role,
      });
      if (!response.user) return;
      props.history.push('/login');
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
              <h3 className="text-center mb-5">Account Register</h3>
              <label htmlFor="username">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="username"
                required
                ref={emailInput}
              />
              <label htmlFor="username">Name</label>
              <input
                type="text"
                placeholder="User Name"
                name="username"
                required
                ref={userNameInput}
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                required
                ref={passwordInput}
              />
              <label htmlFor="username">Role</label>
              <select
                className="form-select"
                required
                ref={roleInput}
                aria-label="Default select example"
              >
                <option value="parent">Parent</option>
                <option value="educator">Educator</option>
              </select>
              <br />
              <br />
              <div className="text-center">
                <button className="btn btn-danger" type="submit">
                  Register
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default Login;
