import {
  API_DATA_ERROR,
  API_DATA_MAIL_CHIMP_SUFFIX, API_DATA_MDB_SUFFIX,
  API_DATA_RECEIVE,
  API_DATA_REQUEST, API_DATA_RESET, API_DATA_SURVEY_GIZMO_SUFFIX
} from './apiData.actions';
import { combineReducers } from 'redux';

const getDefaultState = () => ({
  pending: false,
  data: null,
  error: null
});

export const apiDataBuilder = suffix => (state = getDefaultState(), action) => {
  switch (action.type) {
    case `${API_DATA_REQUEST} ${suffix}`:
      return {...state, pending: true};
    case `${API_DATA_RECEIVE} ${suffix}`:
      return {...state, pending: false, data: action.data, error: null};
    case `${API_DATA_ERROR} ${suffix}`:
      return {...state, pending: false, data: null, error: action.error};
    case `${API_DATA_RESET} ${suffix}`:
      return getDefaultState();
    default:
      return state;
  }
};

export const apiData = combineReducers({
  mdb: apiDataBuilder(API_DATA_MDB_SUFFIX),
  mailChimp: apiDataBuilder(API_DATA_MAIL_CHIMP_SUFFIX),
  surveyGizmo: apiDataBuilder(API_DATA_SURVEY_GIZMO_SUFFIX)
});
