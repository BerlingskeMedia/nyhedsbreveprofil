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




function fetchUserTicket (accountInfo) {

  const payload = {
    UID: accountInfo.UID,
    UIDSignature: accountInfo.UIDSignature,
    signatureTimestamp: accountInfo.signatureTimestamp,
  };

  return fetch(new Request('/authenticate',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  ))
  .then(response => userTicketReponseHandler(response));
}


function reissueUserTicket (){
  return fetch(new Request('/authenticate',
    {
      method: 'GET'
    }
  ))
  .then(response => userTicketReponseHandler(response))
  .catch(err => {

  });
}


function userTicketReponseHandler (response) {
  if(response.ok) {
    response
    .json()
    .then(userTicket => {
      setTimeout(reissueUserTicket, userTicket.exp - Date.now() - (60 * 1000));
      return Promise.resolve(userTicket);
    });
  } else {
    setTimeout(reissueUserTicket, 60 * 1000); // One minute
    return Promise.reject()
  }
}




// export const refetchJwt = scheduleTimeoutId => ({
//   type: SCHEDULE_REFETCH,
//   scheduleTimeoutId
// });

// export const cancelJwtRefetch = actionBuilder(CANCEL_REFETCH);

// const reissueUserTicket = () => {
//   return fetch(new Request('/authenticate',
//     {
//       method: 'GET'
//     }
//   ))
//   .then(response => userTicketReponseHandler(response))
//   .catch(err => {

//   });
// };

// export const fetchUserTicket___ = (config, userInfo) => {
  
//   const getUserTicketPayload = {
//     UID: userInfo.UID,
//     UIDSignature: userInfo.UIDSignature,
//     signatureTimestamp: userInfo.signatureTimestamp,
//   };

//   return Api.post(`/authenticate`, getUserTicketPayload)
//   .then(response => response.text())
//   .then(userTicket => {
    
//     setTimeout(reissueUserTicket, userTicket.exp - Date.now() - 1000);

//     console.log(userTicket);
//     return Promise.resolve(userTicket);
//   });
// };

export const fetchUserInfo = () => {
  return (dispatch, getState) => {
    dispatch(requestUserInfo());

    return new Promise(fulfill => {
      gigya.accounts.getAccountInfo({
        include: 'profile',
        extraProfileFields: 'address,phones',
        callback: userInfo => {

          if (userInfo.errorCode === 0) {
            fetchUserTicket(userInfo)
            .then(jwt => {
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

// export const scheduleJwtRefetch = jwt => {
//   return dispatch => {
//     const timeout = setTimeout(() => {
//       dispatch(fetchUserInfo());
//     }, decode(jwt).userTicket.exp - Date.now());

//     dispatch(refetchJwt(timeout));
//   };
// };

// export const cancelJwtSchedule = () => {
//   return (dispatch, getState) => {
//     const {scheduleTimeout} = getState().userInfo;

//     if (scheduleTimeout) {
//       clearTimeout(scheduleTimeout);
//     }

//     dispatch(cancelJwtRefetch());
//   };
// };