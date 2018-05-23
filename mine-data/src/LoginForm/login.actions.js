import {
  fetchUserToken, receiveUserInfo,
  verifyUser
} from '../common/userInfo.actions';

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

export const login = ({username, password}) => {
  return (dispatch, getState) => {
    dispatch(requestLogin());

    return new Promise(fulfill => {
      gigya.accounts.login({
        loginID: username,
        password: password,
        callback: userInfo => {
          if (userInfo.errorCode === 0) {
            const {config} = getState();

            fetchUserToken(config, userInfo).then(jwt => {
              dispatch(receiveUserInfo(userInfo, jwt));
              dispatch(verifyUser());
              dispatch(resetLogin());
            });
          } else {
            dispatch(receiveLogin(userInfo));
          }

          fulfill(userInfo);
        }
      });
    });
  }
};
