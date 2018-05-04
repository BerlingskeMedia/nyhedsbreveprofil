import {
  ADD_CATEGORY, REMOVE_CATEGORY, RESET_CATEGORIES, SET_MODE_DELETE,
  SET_MODE_INSIGHT, SET_MODE_NONE
} from './categoryManualList.actions';
import { combineReducers } from 'redux';

export const list = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      return [...state, action.category];
    case REMOVE_CATEGORY:
      const categoryAt = state.indexOf(action.category);
      return [...state.slice(0, categoryAt), ...state.slice(categoryAt + 1)];
    case RESET_CATEGORIES:
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

export const categoryManualList = combineReducers({
  list,
  mode
});