import { Api } from '../common/api';

export const ADD_CATEGORY = '[category manual list] add';
export const REMOVE_CATEGORY = '[category manual list] remove';
export const RESET_CATEGORIES = '[category manual list] reset';

export const SET_MODE_INSIGHT = '[category manual list] mode insight';
export const SET_MODE_DELETE = '[category manual list] mode delete';
export const SET_MODE_NONE = '[category manual list] mode none';

export const SUBMIT_REQUEST = '[category manual list] request submit';
export const SUBMIT_RECEIVE = '[category manual list] receive submit';
export const SUBMIT_RESET = '[category manual list] reset submit';
export const SUBMIT_FAILED = '[category manual list] failed submit';

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  category
});

export const removeCategory = (category) => ({
  type: REMOVE_CATEGORY,
  category
});

export const resetCategories = () => ({
  type: RESET_CATEGORIES
});

export const setInsightMode = () => ({
  type: SET_MODE_INSIGHT
});

export const setDeleteMode = () => ({
  type: SET_MODE_DELETE
});

export const setNoneMode = () => ({
  type: SET_MODE_NONE
});

export const setMode = (mode) => {
  if (mode === 'insight') {
    return setInsightMode();
  }

  return setDeleteMode();
};

export const requestSubmit = (mode) => ({
  type: SUBMIT_REQUEST,
  mode
});

export const receiveSubmit = () => ({
  type: SUBMIT_RECEIVE
});

export const resetSubmit = () => ({
  type: SUBMIT_RESET
});

export const failedSubmit = () => ({
  type: SUBMIT_FAILED
});

export const submitTicket = (payload) => {
  return dispatch => {
    dispatch(requestSubmit(payload.mode));

    return Api.post('/mine-data/zendesk/request', payload)
      .then(() => {
        dispatch(receiveSubmit());
        dispatch(setNoneMode());
      })
      .catch(() => {
        dispatch(failedSubmit());
      });
  }
};