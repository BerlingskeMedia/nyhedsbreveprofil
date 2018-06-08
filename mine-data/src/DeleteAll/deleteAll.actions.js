import { actionBuilder } from '../common/redux-utils';

export const DELETE_ALL_SHOW_CONFIRM = '[delete all] show confirm';
export const DELETE_ALL_CANCEL_CONFIRM = '[delete all] cancel confirm';

export const showConfirm = actionBuilder(DELETE_ALL_SHOW_CONFIRM);
export const cancelConfirm = actionBuilder(DELETE_ALL_CANCEL_CONFIRM);

export const DELETE_ALL_REQUEST = '[delete all] request';
export const DELETE_ALL_RECEIVE = '[delete all] receive';
export const DELETE_ALL_RESET = '[delete all] reset';

export const request = actionBuilder(DELETE_ALL_REQUEST);
export const receive = actionBuilder(DELETE_ALL_RECEIVE);
export const reset = actionBuilder(DELETE_ALL_RESET);

export const submit = () => {
  return (dispatch, getState) => {
    const {apiData} = getState();

    dispatch(request());

    // do the actual deletion

    setTimeout(() => {
      dispatch(cancelConfirm());
      dispatch(receive());
    }, 2000);
  };
};