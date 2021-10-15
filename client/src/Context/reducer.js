let user = sessionStorage.getItem('currentUser')
  ? JSON.parse(sessionStorage.getItem('currentUser'))
  : '';

export const initialState = {
  user: '' || user,
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        loading: true,
      };
    case 'REQUEST_REGISTER':
      return {
        ...initialState,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        loading: false,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...initialState,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case 'REGISTER_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
