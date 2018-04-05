import {
  REQUEST_USER_INFO, RECEIVE_USER_INFO,
  RESET_USER_INFO
} from '../actions/userInfo';

export function userInfo(state = {
  isFetched: false,
  isPending: false
}, action) {
  switch (action.type) {
    case REQUEST_USER_INFO:
      return {...state, isPending: true};
    case RECEIVE_USER_INFO:
      return {isFetched: true, isPending: false, userInfo: action.userInfo};
    case RESET_USER_INFO:
      return {isFetched: false, isPending: false, userInfo: null};
  }

  return state;
}