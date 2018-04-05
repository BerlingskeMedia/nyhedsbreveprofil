export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export const RESET_USER_INFO = 'RESET_USER_INFO';

export const requestUserInfo = () => ({type: REQUEST_USER_INFO});
export const receiveUserInfo = (userInfo) => ({type: RECEIVE_USER_INFO, userInfo});
export const resetUserInfo = () => ({type: RESET_USER_INFO});

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
