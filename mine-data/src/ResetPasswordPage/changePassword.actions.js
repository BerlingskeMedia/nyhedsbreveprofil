import { actionBuilder } from '../common/redux-utils';

export const REQUEST_CHANGE_PASSWORD = '[change password] request';
export const RECEIVE_CHANGE_PASSWORD = '[change password] receive';
export const RESET_CHANGE_PASSWORD = '[change password] reset';

export const requestChangePassword = actionBuilder(REQUEST_CHANGE_PASSWORD);
export const resetChangePassword = actionBuilder(RESET_CHANGE_PASSWORD);
export const receiveChangePassword = response => ({
  type: RECEIVE_CHANGE_PASSWORD,
  response
});

export const fetchChangePassword = (newPassword, passwordResetToken) => {
  return dispatch => {
    dispatch(requestChangePassword());

    gigya.accounts.resetPassword({
      newPassword,
      passwordResetToken,
      callback: response => {
        if (response.errorCode === 0) {
          dispatch(receiveChangePassword());
        } else {
          dispatch(receiveChangePassword(response));
        }
      }
    });
  };
};