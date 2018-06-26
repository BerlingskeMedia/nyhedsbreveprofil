import { actionBuilder } from '../common/redux-utils';
import { Api } from '../common/api';
import { resetAll } from '../CategoryApiList/apiData.actions';
import { logOut } from '../logout/logOut.actions';

export const DELETE_ALL_SHOW_CONFIRM = '[delete all] show confirm';
export const DELETE_ALL_CANCEL_CONFIRM = '[delete all] cancel confirm';

export const showConfirm = actionBuilder(DELETE_ALL_SHOW_CONFIRM);
export const cancelConfirm = actionBuilder(DELETE_ALL_CANCEL_CONFIRM);

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

export const submit = () => {
  return (dispatch, getState) => {
    const {apiData, userInfo: {userInfo, jwt}, categoryManualList} = getState();
    const promises = [];

    dispatch(request());

    if (apiData.mdb.data) {
      promises.push(Api.delete('/mine-data/category/mdb/user', jwt));
    }

    if (apiData.mailChimp.data) {
      apiData.mailChimp.data.map(item => {
        promises.push(Api.delete(`/mine-data/category/mailchimp/${item.list_id}/${item.id}`, jwt));
      });
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