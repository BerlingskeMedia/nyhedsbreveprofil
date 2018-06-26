import {
  REQUEST_USER_INFO, RECEIVE_USER_INFO,
  RESET_USER_INFO, VERIFY_USER, SCHEDULE_REFETCH, CANCEL_REFETCH
} from './userInfo.actions';

export const defaultUserInfoState = () => ({
  isFetched: false,
  isPending: false,
  isVerified: false,
  userInfo: null,
  scheduleTimeoutId: null,
  jwt: null
});

export function userInfo(state = defaultUserInfoState(), action) {
  switch (action.type) {
    case REQUEST_USER_INFO:
      return {...state, isPending: true};
    case RECEIVE_USER_INFO:
      return {isFetched: true, isPending: false, userInfo: action.userInfo, jwt: action.jwt};
    case VERIFY_USER:
      return {...state, isVerified: true};
    case SCHEDULE_REFETCH:
      return {...state, scheduleTimeoutId: action.scheduleTimeoutId};
    case CANCEL_REFETCH:
      return {...state, scheduleTimeoutId: null};
    case RESET_USER_INFO:
      return defaultUserInfoState();
    default:
      return state;
  }
}