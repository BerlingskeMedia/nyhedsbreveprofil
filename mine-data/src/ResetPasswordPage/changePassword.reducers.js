import {
  RECEIVE_CHANGE_PASSWORD,
  REQUEST_CHANGE_PASSWORD,
  RESET_CHANGE_PASSWORD
} from './changePassword.actions';

const getDefaultChangePasswordState = () => ({
  pending: false,
  fetched: false,
  response: null
});

export const changePasswordForm = (state = getDefaultChangePasswordState(), action) => {
  switch (action.type) {
    case REQUEST_CHANGE_PASSWORD:
      return {...state, pending: true};
    case RECEIVE_CHANGE_PASSWORD:
      return {...state, pending: false, fetched: true, response: action.response};
    case RESET_CHANGE_PASSWORD:
      return getDefaultChangePasswordState();
    default:
      return state;
  }
};
