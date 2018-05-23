import { verifyUser } from '../common/userInfo.actions';

export const REQUEST_VERIFY = '[verify user] request';
export const RECEIVE_VERIFY = '[verify user] receive';
export const RESET_VERIFY = '[verify user] reset';

export const requestVerifyUser = () => ({type: REQUEST_VERIFY});
export const receiveVerifyUser = (response) => ({type: RECEIVE_VERIFY, response});
export const resetVerifyUser = () => ({type: RESET_VERIFY});

export const fetchVerifyUser = (password) => {
  return (dispatch) => {
    dispatch(requestVerifyUser());

    return new Promise(fulfill => {
      gigya.accounts.login({
        loginID: 'reAuth',
        password,
        loginMode: 'reAuth',
        callback: response => {
          if (response.errorCode === 0) {
            dispatch(resetVerifyUser());
            dispatch(verifyUser());
          } else {
            dispatch(receiveVerifyUser(response));
          }

          fulfill(response);
        }
      });
    });
  };
};
