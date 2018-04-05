import { resetUserInfo } from './userInfo';

export const logOut = () => {
  return dispatch => {
    return new Promise((fulfill, reject) => {
      gigya.accounts.logout({
        callback: response => {
          if (!response.errorCode) {
            dispatch(resetUserInfo());
            fulfill(response);
          } else {
            reject(response);
          }
        }
      });
    });
  };
};