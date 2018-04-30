import {
  REQUEST_LOGIN, SET_PASSWORD, SET_USERNAME,
  RESET_LOGIN, RECEIVE_LOGIN
} from './login.actions';

export const defaultLoginState = () => ({
  pending: false,
  username: '',
  password: '',
  response: null
});

export const login = (state = defaultLoginState(), action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return {...state, pending: true, response: null};
    case RECEIVE_LOGIN:
      return {...state, pending: false, response: action.response};
    case RESET_LOGIN:
      return defaultLoginState();
    case SET_USERNAME:
      return {...state, username: action.username};
    case SET_PASSWORD:
      return {...state, password: action.password};
    default:
      return state;
  }
};