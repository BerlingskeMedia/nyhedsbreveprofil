import { Api } from '../common/api';
import { actionBuilder } from '../common/redux-utils';

export const REQUEST_CATEGORIES = '[category manual list] request categories';
export const RECEIVE_CATEGORIES = '[category manual list] receive categories';

export const ADD_CATEGORY = '[category manual list] add';
export const REMOVE_CATEGORY = '[category manual list] remove';
export const RESET_CATEGORY_LIST = '[category manual list] reset';

export const SET_MODE_INSIGHT = '[category manual list] mode insight';
export const SET_MODE_DELETE = '[category manual list] mode delete';
export const SET_MODE_NONE = '[category manual list] mode none';

export const SUBMIT_REQUEST = '[category manual list] request submit';
export const SUBMIT_RECEIVE = '[category manual list] receive submit';
export const SUBMIT_RESET = '[category manual list] reset submit';
export const SUBMIT_FAILED = '[category manual list] failed submit';

export const CONFIRM_SHOW = '[category manual list] show confirmation';
export const CONFIRM_HIDE = '[category manual list] hide confirmation';
export const CONFIRM_ALLOWED = '[category manual list] confirmation allowance';
export const CONFIRM_ERROR = '[category manual list] confirmation error';

export const requestCategories = actionBuilder(REQUEST_CATEGORIES);
export const receiveCategories = (categories) => ({
  type: RECEIVE_CATEGORIES,
  categories
});

export const fetchCategories = () => {
  return dispatch => {
    dispatch(requestCategories());

    Api.get('/mine-data/categories')
      .then(response => {
        dispatch(receiveCategories(response.categories));
      });
  };
};

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  category
});

export const removeCategory = (category) => ({
  type: REMOVE_CATEGORY,
  category
});

export const resetCategoryList = actionBuilder(RESET_CATEGORY_LIST);
export const setInsightMode = actionBuilder(SET_MODE_INSIGHT);
export const setDeleteMode = actionBuilder(SET_MODE_DELETE);
export const setNoneMode = actionBuilder(SET_MODE_NONE);

export const setMode = (mode) => {
  if (mode === 'insight') {
    return setInsightMode();
  }

  return setDeleteMode();
};

export const requestSubmit = actionBuilder(SUBMIT_REQUEST);
export const receiveSubmit = actionBuilder(SUBMIT_RECEIVE);
export const resetSubmit = actionBuilder(SUBMIT_RESET);
export const failedSubmit = errorCode => ({
  type: SUBMIT_FAILED,
  errorCode
});

export const submitTicket = payload => {
  return (dispatch, getState) => {
    dispatch(requestSubmit());

    return Api.post('/mine-data/zendesk/request', payload, getState().userInfo.jwt)
      .then(() => {
        dispatch(receiveSubmit());
        dispatch(setNoneMode());
      })
      .catch(err => {
        dispatch(failedSubmit(err.status));
      });
  }
};

export const confirm = mode => ({
  type: CONFIRM_SHOW,
  mode
});

export const confirmAllowed = allowed => ({
  type: CONFIRM_ALLOWED,
  allowed
});

export const confirmError = () => ({
  type: CONFIRM_ERROR
});

export const showConfirmation = mode => {
  return (dispatch, getState) => {
    dispatch(confirm(mode));

    return Api.get('/mine-data/zendesk/check', getState().userInfo.jwt)
      .then(response => {
        dispatch(confirmAllowed(response));
      })
      .catch(() => {
        dispatch(confirmError());
      });
  };
};
export const hideConfirmation = actionBuilder(CONFIRM_HIDE);
