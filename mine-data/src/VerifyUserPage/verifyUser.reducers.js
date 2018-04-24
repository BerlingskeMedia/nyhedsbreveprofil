import {
  RECEIVE_VERIFY, REQUEST_VERIFY,
  RESET_VERIFY, SET_PASSWORD
} from './verifyUser.actions';

export const defaultVerifyUser = () => ({
  isPending: false,
  response: null,
  password: ''
});

export const verifyUser = (state = defaultVerifyUser(), action) => {
  switch (action.type) {
    case REQUEST_VERIFY:
      return {...state, isPending: true};
    case RECEIVE_VERIFY:
      return {...state, isPending: false, response: action.response};
    case RESET_VERIFY:
      return defaultVerifyUser();
    case SET_PASSWORD:
      return {...state, password: action.password};
    default:
      return state;
  }
};