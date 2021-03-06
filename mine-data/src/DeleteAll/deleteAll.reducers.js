import {
  DELETE_ALL_CANCEL_CONFIRM, DELETE_ALL_ERROR, DELETE_ALL_RECEIVE,
  DELETE_ALL_REQUEST,
  DELETE_ALL_RESET,
  DELETE_ALL_SHOW_CONFIRM,
  DELETE_ALL_RECEIVE_SUBSCRIPTION_STATUS, DELETE_ALL_REQUEST_SUBSCRIPTION_STATUS
} from './deleteAll.actions';
import { combineReducers } from 'redux';

export const getSubscriptionDefaultStatus = () => ({
  pending: false,
  status: true
});

export const subscriptionStatus = (state = getSubscriptionDefaultStatus(), action) => {
  switch (action.type) {
    case DELETE_ALL_REQUEST_SUBSCRIPTION_STATUS:
      return {...state, pending: true, status: true};
    case DELETE_ALL_RECEIVE_SUBSCRIPTION_STATUS:
      return {...state, pending: false, status: action.signatureStatus};
    default:
      return state;
  }
};

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
  fetched: false,
  error: null
});

const request = (state = getDefaultRequestState(), action) => {
  switch (action.type) {
    case DELETE_ALL_REQUEST:
      return {...state, fetched: false, pending: true};
    case DELETE_ALL_RECEIVE:
      return {...state, fetched: true, pending: false, error: null};
    case DELETE_ALL_ERROR:
      return {...state, fetched: false, pending: false, error: action.error};
    case DELETE_ALL_RESET:
      return getDefaultRequestState();
    default:
      return state;
  }
};

export const deleteAll = combineReducers({
  confirm,
  request,
  subscriptionStatus
});
