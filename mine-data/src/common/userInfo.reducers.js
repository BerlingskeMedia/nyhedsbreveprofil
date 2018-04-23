import {
  REQUEST_USER_INFO, RECEIVE_USER_INFO,
  RESET_USER_INFO
} from '../common/userInfo.actions';

export const defaultUserInfoState = () => ({
  isFetched: false,
  isPending: false,
  userInfo: null
});

export function userInfo(state = defaultUserInfoState(), action) {
  switch (action.type) {
    case REQUEST_USER_INFO:
      return {...state, isPending: true};
    case RECEIVE_USER_INFO:
      return {isFetched: true, isPending: false, userInfo: action.userInfo};
    case RESET_USER_INFO:
      return defaultUserInfoState();
  }

  return state;
}