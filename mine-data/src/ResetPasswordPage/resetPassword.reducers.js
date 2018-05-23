import {
  RECEIVE_RESET_PASSWORD,
  REQUEST_RESET_PASSWORD,
  RESET_RESET_PASSWORD
} from './resetPassword.actions';

const getDefaultResetPasswordState = () => ({
  pending: false,
  fetched: false
});

export const resetPasswordForm = (state = getDefaultResetPasswordState(), action) => {
  switch (action.type) {
    case REQUEST_RESET_PASSWORD:
      return {...state, pending: true};
    case RECEIVE_RESET_PASSWORD:
      return {...state, pending: false, fetched: true};
    case RESET_RESET_PASSWORD:
      return getDefaultResetPasswordState();
    default:
      return state;
  }
};
