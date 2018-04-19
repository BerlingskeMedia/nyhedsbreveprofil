export const ADD_CATEGORY = '[category manual list] add';
export const REMOVE_CATEGORY = '[category manual list] remove';

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  category
});

export const removeCategory = (category) => ({
  type: REMOVE_CATEGORY,
  category
});
