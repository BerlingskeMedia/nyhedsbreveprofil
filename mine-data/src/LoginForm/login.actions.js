import { receiveUserInfo } from '../common/userInfo.actions';

export const REQUEST_LOGIN = '[login] request';
export const RECEIVE_LOGIN = '[login] receive';
export const RESET_LOGIN = '[login] reset';
export const SET_USERNAME = '[login] set username';
export const SET_PASSWORD = '[login] set password';

export const setUsername = (username) => ({
  type: SET_USERNAME,
  username
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  password
});

export const requestLogin = () => ({
  type: REQUEST_LOGIN
});

export const receiveLogin = (response) => ({
  type: RECEIVE_LOGIN,
  response
});

export const resetLogin = () => ({
  type: RESET_LOGIN
});

export const login = ({username, password, rememberMe}) => {
  return (dispatch) => {
    dispatch(requestLogin());

    return new Promise(fulfill => {
      gigya.accounts.login({
        loginID: username,
        password: password,
        sessionExpiration: rememberMe ? -2 : 0,
        callback: response => {
          if (response.errorCode === 0) {
            fulfill(response);
            dispatch(resetLogin());
            dispatch(receiveUserInfo(response));
          } else {
            dispatch(receiveLogin(response));
            fulfill(response);
          }
        }
      });
    });
  }
};
