export const ADD_CATEGORY = '[category manual list] add';
export const REMOVE_CATEGORY = '[category manual list] remove';
export const RESET_CATEGORIES = '[category manual list] reset';

export const SET_MODE_INSIGHT = '[category manual list] mode insight';
export const SET_MODE_DELETE = '[category manual list] mode delete';
export const SET_MODE_NONE = '[category manual list] mode none';

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