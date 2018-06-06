import { Api } from '../common/api';
import { actionBuilder } from '../common/redux-utils';

export const API_DATA_REQUEST = '[api data] request';
export const API_DATA_RECEIVE = '[api data] receive';
export const API_DATA_ERROR = '[api data] error';
export const API_DATA_RESET = '[api data] reset';
export const API_DATA_KU_SUFFIX = 'KU';
export const API_DATA_MDB_SUFFIX = 'MDB';
export const API_DATA_MAIL_CHIMP_SUFFIX = 'MailChimp';
export const API_DATA_SURVEY_GIZMO_SUFFIX = 'SurveyGizmo';

export const fetchKundeunivers = fetchBuilder(API_DATA_KU_SUFFIX, userInfo => `/mine-data/category/kundeunivers/${userInfo.UID}`);
export const fetchMDB = fetchBuilder(API_DATA_MDB_SUFFIX, userInfo => `/mine-data/category/mdb/${userInfo.profile.email}`);
export const fetchMailChimp = fetchBuilder(API_DATA_MAIL_CHIMP_SUFFIX, userInfo => `/mine-data/category/mailchimp/${userInfo.profile.email}`);
export const fetchSurveyGizmo = fetchBuilder(API_DATA_SURVEY_GIZMO_SUFFIX, userInfo => `/mine-data/category/surveygizmo/${userInfo.profile.email}`);

function fetchBuilder(dataSuffix, getRequestUrl) {
  return () => {
    return (dispatch, getState) => {
      const {userInfo} = getState();

      dispatch({
        type: `${API_DATA_REQUEST} ${dataSuffix}`
      });

      Api.get(getRequestUrl(userInfo.userInfo), userInfo.jwt)
        .then(data => dispatch({
          type: `${API_DATA_RECEIVE} ${dataSuffix}`,
          data
        }))
        .catch(error => dispatch({
          type: `${API_DATA_ERROR} ${dataSuffix}`,
          error
        }));
    };
  };
}

export const resetKundeunivers = actionBuilder(`${API_DATA_RESET} ${API_DATA_KU_SUFFIX}`);
export const resetMDB = actionBuilder(`${API_DATA_RESET} ${API_DATA_MDB_SUFFIX}`);
export const resetMailChimp = actionBuilder(`${API_DATA_RESET} ${API_DATA_MAIL_CHIMP_SUFFIX}`);
export const resetSurveyGizmo = actionBuilder(`${API_DATA_RESET} ${API_DATA_SURVEY_GIZMO_SUFFIX}`);