import {
  RECEIVE_VERIFY, REQUEST_VERIFY,
  RESET_VERIFY
} from './verifyUser.actions';

export const defaultVerifyUser = () => ({
  isPending: false,
  response: null,
  password: ''
});

export const verifyUser = (state = defaultVerifyUser(), action) => {
  switch (action.type) {
    case REQUEST_VERIFY:
      return {...state, isPending: true, response: null};
    case RECEIVE_VERIFY:
      return {...state, isPending: false, password: '', response: action.response};
    case RESET_VERIFY:
      return defaultVerifyUser();
    default:
      return state;
  }
};