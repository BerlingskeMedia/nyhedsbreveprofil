export const REQUEST_USER_INFO = '[user info] request';
export const RECEIVE_USER_INFO = '[user info] receive';
export const RESET_USER_INFO = '[user info] reset';
export const VERIFY_USER = '[user info] verify';

export const requestUserInfo = () => ({type: REQUEST_USER_INFO});
export const receiveUserInfo = (userInfo) => ({type: RECEIVE_USER_INFO, userInfo});
export const resetUserInfo = () => ({type: RESET_USER_INFO});
export const verifyUser = () => ({type: VERIFY_USER});

export const fetchUserInfo = () => {
  return (dispatch) => {
    dispatch(requestUserInfo());

    return new Promise(fulfill => {
      gigya.accounts.getAccountInfo({
        callback: response => {
          dispatch(receiveUserInfo(response));
          fulfill(response);
        }
      });
    });
  }
};
