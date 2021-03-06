import {
  ADD_CATEGORY, CONFIRM_ALLOWED, CONFIRM_ERROR, CONFIRM_HIDE, CONFIRM_SHOW,
  RECEIVE_CATEGORIES,
  REMOVE_CATEGORY,
  REQUEST_CATEGORIES,
  RESET_CATEGORY_LIST,
  SET_MODE_DELETE,
  SET_MODE_INSIGHT, SET_MODE_NONE, SUBMIT_FAILED, SUBMIT_RECEIVE,
  SUBMIT_REQUEST, SUBMIT_RESET
} from './categoryManualList.actions';
import { combineReducers } from 'redux';

export const getCategoriesDefaultState = () => ({
  pending: false,
  categories: null
});

export const categories = (state = getCategoriesDefaultState(), action) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {...state, pending: true, categories: null};
    case RECEIVE_CATEGORIES:
      return {...state, pending: false, categories: action.categories};
    default:
      return state;
  }
};

export const list = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      return [...state, action.category];
    case REMOVE_CATEGORY:
      const categoryAt = state.indexOf(action.category);
      return [...state.slice(0, categoryAt), ...state.slice(categoryAt + 1)];
    case RESET_CATEGORY_LIST:
      return [];
    default:
      return state;
  }
};

export const mode = (state = null, action) => {
  switch (action.type) {
    case SET_MODE_INSIGHT:
      return 'insight';
    case SET_MODE_DELETE:
      return 'delete';
    case SET_MODE_NONE:
      return null;
    default:
      return state;
  }
};

export const getSubmitDefaultState = () => ({
  pending: false,
  fetched: false,
  failed: false,
  errorCode: null
});

export const submit = (state = getSubmitDefaultState(), action) => {
  switch (action.type) {
    case SUBMIT_REQUEST:
      return {...state, pending: true, fetched: false, failed: false};
    case SUBMIT_RECEIVE:
      return {...state, pending: false, fetched: true, failed: false};
    case SUBMIT_FAILED:
      return {...state, pending: false, fetched: true, failed: true, errorCode: action.errorCode};
    case SUBMIT_RESET:
      return getSubmitDefaultState();
    default:
      return state;
  }
};

const getConfirmModeDefaultState = () => ({
  mode: null,
  visible: false,
  pending: false,
  allowed: false,
  error: false
});

export const confirmMode = (state = getConfirmModeDefaultState(), action) => {
  switch (action.type) {
    case CONFIRM_SHOW:
      return {...state, visible: true, mode: action.mode, pending: true, error: false, allowed: false};
    case CONFIRM_ALLOWED:
      return {...state, allowed: action.allowed, pending: false};
    case CONFIRM_ERROR:
      return {...state, error: true, pending: false};
    case CONFIRM_HIDE:
      return {...state, visible: false};
    default:
      return state;
  }
};

export const categoryManualList = combineReducers({
  list,
  mode,
  submit,
  categories,
  confirmMode
});
