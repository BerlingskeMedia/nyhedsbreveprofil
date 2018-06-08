import {
  DELETE_ALL_CANCEL_CONFIRM, DELETE_ALL_RECEIVE, DELETE_ALL_REQUEST,
  DELETE_ALL_RESET,
  DELETE_ALL_SHOW_CONFIRM
} from './deleteAll.actions';
import { combineReducers } from 'redux';

const getDefaultConfirmState = () => false;

const confirm = (state = getDefaultConfirmState(), action) => {
  switch (action.type) {
    case DELETE_ALL_SHOW_CONFIRM:
      return true;
    case DELETE_ALL_CANCEL_CONFIRM:
      return false;
    default:
      return state;
  }
};

const getDefaultRequestState = () => ({
  pending: false,
  fetched: false
});

const request = (state = getDefaultRequestState(), action) => {
  switch (action.type) {
    case DELETE_ALL_REQUEST:
      return {...state, fetched: false, pending: true};
    case DELETE_ALL_RECEIVE:
      return {...state, fetched: true, pending: false};
    case DELETE_ALL_RESET:
      return getDefaultRequestState();
    default:
      return state;
  }
};

export const deleteAll = combineReducers({
  confirm,
  request
});