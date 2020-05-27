import { actionBuilder } from '../common/redux-utils';
import { Api } from '../common/api';
import { resetAll } from '../CategoryApiList/apiData.actions';
import { logOut } from '../logout/logOut.actions';

export const DELETE_ALL_SHOW_CONFIRM = '[delete all] show confirm';
export const DELETE_ALL_CANCEL_CONFIRM = '[delete all] cancel confirm';

export const showConfirm = actionBuilder(DELETE_ALL_SHOW_CONFIRM);
export const cancelConfirm = actionBuilder(DELETE_ALL_CANCEL_CONFIRM);

export const DELETE_ALL_REQUEST_SUBSCRIPTION_STATUS = '[delete all] request subscription status';
export const DELETE_ALL_RECEIVE_SUBSCRIPTION_STATUS = '[delete all] receive subscription status';
export const subscriptionStatusRequest = actionBuilder(DELETE_ALL_REQUEST_SUBSCRIPTION_STATUS);
export const receiveSignatureStatus = (signatureStatus) => ({
    type: DELETE_ALL_RECEIVE_SUBSCRIPTION_STATUS,
    signatureStatus
});

export const DELETE_ALL_REQUEST = '[delete all] request';
export const DELETE_ALL_RECEIVE = '[delete all] receive';
export const DELETE_ALL_RESET = '[delete all] reset';
export const DELETE_ALL_ERROR = '[delete all] error';

export const request = actionBuilder(DELETE_ALL_REQUEST);
export const receive = actionBuilder(DELETE_ALL_RECEIVE);
export const reset = actionBuilder(DELETE_ALL_RESET);
export const error = error => ({
  type: DELETE_ALL_ERROR,
  error
});

export const finalize = () => {
  return dispatch => {
    dispatch(reset());
    dispatch(logOut());
  };
};

export const checkIfSubscriptionActive = () => {
    return dispatch => {
        dispatch(subscriptionStatusRequest());

        return Api.get('/mine-data/category/aria')
        .then((data) => {
            let subscriptionInfo = data["subsRetrieveSubscriptionResponseDetails"]["subsRetrieveSubscriptionList"];

            if (subscriptionInfo && subscriptionInfo.length > 0) {
                dispatch(receiveSignatureStatus(true));
            } else {
                dispatch(receiveSignatureStatus(false));
            }
        })
        .catch(err => {
            console.log(err);
            dispatch(receiveSignatureStatus(false));
        });
    }
};

export const submit = () => {
  return (dispatch, getState) => {
    const {apiData, userInfo: {userInfo, jwt}, categoryManualList} = getState();
    const promises = [];

    dispatch(request());

    if (apiData.mdb.data) {
      promises.push(Api.delete('/mine-data/category/mdb/user', jwt));
    }

    if (apiData.surveyGizmo.data) {
      apiData.surveyGizmo.data.map(survey => {
        promises.push(Api.delete(`/mine-data/category/surveygizmo/${survey.survey_id}/${survey.response_id}`, jwt));
      });
    }

    promises.push(
      Api.post('/mine-data/zendesk/request', {
        categories: categoryManualList.categories.categories.map(category => category.name),
        user: userInfo.profile,
        mode: 'delete'
      }, jwt)
    );

    Promise.all(promises)
      .then(() => Api.delete('/mine-data/account', jwt))
      .then(() => {
        dispatch(cancelConfirm());
        dispatch(receive());
      })
      .catch(err => {
        dispatch(cancelConfirm());
        dispatch(resetAll());
        dispatch(error(err));
      });
  };
};
