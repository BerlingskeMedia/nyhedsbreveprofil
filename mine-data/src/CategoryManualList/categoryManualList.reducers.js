import { ADD_CATEGORY, REMOVE_CATEGORY } from './categoryManualList.actions';

export const categoryManualList = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      return [...state, action.category];
    case REMOVE_CATEGORY:
      const categoryAt = state.indexOf(action.category);
      return [...state.slice(0, categoryAt), ...state.slice(categoryAt + 1)];
    default:
      return state;
  }
};