import { resetUserInfo } from '../common/userInfo.actions';

export const logOut = () => {
  return dispatch => {
    return new Promise((fulfill, reject) => {
      gigya.accounts.logout({
        callback: response => {
          if (!response.errorCode || response.errorCode === 403013) {
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