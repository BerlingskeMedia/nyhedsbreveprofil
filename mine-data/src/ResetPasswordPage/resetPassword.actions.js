import { actionBuilder } from '../common/redux-utils';

export const REQUEST_RESET_PASSWORD = '[reset password] request';
export const RECEIVE_RESET_PASSWORD = '[reset password] receive';
export const RESET_RESET_PASSWORD = '[reset password] reset';

export const requestResetPassword = actionBuilder(REQUEST_RESET_PASSWORD);
export const receiveResetPassword = actionBuilder(RECEIVE_RESET_PASSWORD);
export const resetResetPassword = actionBuilder(RESET_RESET_PASSWORD);

export const fetchResetPassword = email => {
  return dispatch => {
    dispatch(requestResetPassword());

    gigya.accounts.resetPassword({
      loginID: email,
      callback: response => {
        if (response.errorCode === 0) {
          dispatch(receiveResetPassword());
        } else {
          // TODO: do we want to show an error message?
          dispatch(receiveResetPassword());
        }
      }
    });
  }
};
