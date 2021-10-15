import Axios from '../Config/axios';

export async function loginUser(dispatch, loginPayload) {
  try {
    dispatch({type: 'REQUEST_LOGIN'});
    let response = await Axios.post('auth/login', {
      email: loginPayload.email,
      password: loginPayload.password,
    });
    if (response.data.user) {
      dispatch({type: 'LOGIN_SUCCESS', payload: response.data});
      sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
      return response.data;
    }
    dispatch({type: 'LOGIN_ERROR', error: 'Server Error'});
    return;
  } catch (error) {
    dispatch({type: 'LOGIN_ERROR', error: 'Unauthorized'});
  }
}

export async function registerUser(dispatch, registerPayload) {
  try {
    dispatch({type: 'REQUEST_REGISTER'});
    let response = await Axios.post('auth/signin', {
      email: registerPayload.email,
      name: registerPayload.name,
      role: registerPayload.role,
      password: registerPayload.password,
    });
    if (response.data.user) {
      dispatch({type: 'REGISTER_SUCCESS', payload: response.data.user});
      return response.data;
    }
    dispatch({type: 'REGISTER_ERROR', error: 'Server Error'});
    return;
  } catch (error) {
    dispatch({type: 'REGISTER_ERROR', error: 'Unauthorized'});
  }
}

export async function logout(dispatch) {
  await Axios.get('/logout');
  Axios.defaults.headers.common['Authorization'] = '';
  dispatch({type: 'LOGOUT'});
  sessionStorage.removeItem('currentUser');
}
