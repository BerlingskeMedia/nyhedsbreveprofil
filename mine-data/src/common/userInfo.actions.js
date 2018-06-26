import { Api } from './api';
import { actionBuilder } from './redux-utils';
import { decode } from 'jsonwebtoken';

export const REQUEST_USER_INFO = '[user info] request';
export const RECEIVE_USER_INFO = '[user info] receive';
export const RESET_USER_INFO = '[user info] reset';
export const VERIFY_USER = '[user info] verify';

export const SCHEDULE_REFETCH = '[user info] schedule refetch';
export const CANCEL_REFETCH = '[user info] cancel refetch';

export const requestUserInfo = actionBuilder(REQUEST_USER_INFO);
export const receiveUserInfo = ({UID, profile, errorCode}, jwt) => ({
  type: RECEIVE_USER_INFO,
  userInfo: {UID, profile, errorCode},
  jwt
});
export const resetUserInfo = actionBuilder(RESET_USER_INFO);
export const verifyUser = actionBuilder(VERIFY_USER);
export const refetchJwt = scheduleTimeoutId => ({
  type: SCHEDULE_REFETCH,
  scheduleTimeoutId
});
export const cancelJwtRefetch = actionBuilder(CANCEL_REFETCH);

const getRsvpPayload = (userInfo, app) => ({
  app,
  provider: 'gigya',
  UID: userInfo.UID,
  UIDSignature: userInfo.UIDSignature,
  signatureTimestamp: userInfo.signatureTimestamp,
  email: encodeURI(userInfo.profile.email)
});

export const fetchUserToken = (config, userInfo) => {
  return Api.request(`${config.bpcUrl}/rsvp`, {method: 'post', payload: getRsvpPayload(userInfo, config.bpcAppId)}, true)
    .then(response => response.json())
    .then(({rsvp}) => Api.post(`/mine-data/ticket/${rsvp}`, {uid: userInfo.UID, email: userInfo.profile.email}))
    .then(response => response.text());
};

export const fetchUserInfo = () => {
  return (dispatch, getState) => {
    dispatch(requestUserInfo());

    return new Promise(fulfill => {
      gigya.accounts.getAccountInfo({
        include: 'profile',
        extraProfileFields: 'address,phones',
        callback: userInfo => {
          const {config} = getState();

          if (userInfo.errorCode === 0) {
            fetchUserToken(config, userInfo).then(jwt => {
              dispatch(receiveUserInfo(userInfo, jwt));
              fulfill(jwt);
            });
          } else {
            dispatch(receiveUserInfo(userInfo, null));
            fulfill();
          }
        }
      });
    });
  }
};

export const scheduleJwtRefetch = jwt => {
  return dispatch => {
    const timeout = setTimeout(() => {
      dispatch(fetchUserInfo());
    }, decode(jwt).userTicket.exp - Date.now());

    dispatch(refetchJwt(timeout));
  };
};

export const cancelJwtSchedule = () => {
  return (dispatch, getState) => {
    const {scheduleTimeout} = getState().userInfo;

    if (scheduleTimeout) {
      clearTimeout(scheduleTimeout);
    }

    dispatch(cancelJwtRefetch());
  };
};