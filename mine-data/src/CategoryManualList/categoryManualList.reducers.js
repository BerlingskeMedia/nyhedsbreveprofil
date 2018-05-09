import {
  ADD_CATEGORY, RECEIVE_CATEGORIES, REMOVE_CATEGORY, REQUEST_CATEGORIES,
  RESET_CATEGORIES,
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
    case RESET_CATEGORIES:
      return getCategoriesDefaultState();
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
  mode: null
});

export const submit = (state = getSubmitDefaultState(), action) => {
  switch (action.type) {
    case SUBMIT_REQUEST:
      return {...state, pending: true, fetched: false, failed: false, mode: action.mode};
    case SUBMIT_RECEIVE:
      return {...state, pending: false, fetched: true, failed: false};
    case SUBMIT_FAILED:
      return {...state, pending: false, fetched: true, failed: true};
    case SUBMIT_RESET:
      return getSubmitDefaultState();
    default:
      return state;
  }
};

export const categoryManualList = combineReducers({
  list,
  mode,
  submit,
  categories
});