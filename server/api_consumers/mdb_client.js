const Http = require('../lib/http');
const Url = require('url');

var MDBAPI_ADDRESS;

try {

  var temp = Url.parse(process.env.MDBAPI_ADDRESS);

  if(['http:', 'https:'].indexOf(temp.protocol) > -1) {

    MDBAPI_ADDRESS = process.env.MDBAPI_ADDRESS;

  } else if (process.env.MDBAPI_PORT) {

      MDBAPI_ADDRESS = `http://${process.env.MDBAPI_ADDRESS}:${process.env.MDBAPI_PORT}`
    
  } else {

    throw new Error();
  
  }

} catch (ex) {
  console.error('Env var MDBAPI_ADDRESS missing or invalid.');
  process.exit(1);
}

console.log('Connecting mdb_client to MDBAPI on', MDBAPI_ADDRESS);


class MDB {

  static getData(eksternId) {
    const interests = MDB.getInterests();
    const newsletters = MDB.getNewsletters();
    const profile = MDB.getUserProfile(eksternId);

    return Promise.all([interests, newsletters, profile])
      .then(([interests, newsletters, profile]) => MDB.mapper(interests, newsletters, profile));
  }

  static mapper(interests, newsletters, profile) {
    const allData = {profile};

    allData.nyhedsbreve_list = newsletters
      .filter(newsletter => profile.nyhedsbreve.includes(newsletter.nyhedsbrev_id))
      .map(newsletter => ({
        id: newsletter.nyhedsbrev_id,
        name: newsletter.nyhedsbrev_navn,
        time: newsletter.tidspunkt,
        description: newsletter.indhold
      }));

    allData.permission_list = interests
      .filter(permission => profile.permissions.includes(permission.interesse_id))
      .map(permission => ({
        id: permission.interesse_id,
        name: permission.interesse_navn,
        time: permission.oprettet,
        description: permission.beskrivelse
      }));

    allData.interesser_list = interests
      .filter(permission => profile.interesser.includes(permission.interesse_id))
      .map(permission => ({
        id: permission.interesse_id,
        name: permission.interesse_navn,
        time: permission.oprettet,
        description: permission.beskrivelse
      }));

    return allData;
  }

  static findUser(email) {
    return Http.get(`${MDBAPI_ADDRESS}/users?email=${encodeURIComponent(email)}`)
      .then(result => result[0]);
  };

  static findSurveyGizmoUser(email) {
    return Http.get(`${MDBAPI_ADDRESS}/surveys?email=${encodeURIComponent(email)}`);
  };

  static getUserProfile(eksternId) {
    return Http.get(`${MDBAPI_ADDRESS}/users/${eksternId}`);
  }

  static getInterests() {
    return Http.get(`${MDBAPI_ADDRESS}/interesser/full`);

  }

  static getNewsletters() {
    return Http.get(`${MDBAPI_ADDRESS}/nyhedsbreve`);
  }

  /**
   *
   * @param surveyId
   * @param email - is to validate record with our database
   * @param responseId
   */
  static deleteSurveyGizmoResponse(surveyId, email, responseId) {
    return MDB.findSurveyGizmoUser(email).then(items => {
      const surveyIdNumber = parseInt(surveyId,10);
      const item = items.find(item => {
        return item.response_id === responseId && item.survey_id === surveyIdNumber
      });
      if (item) {
        return Http.get(MDB.surveyGizmoDeletePath(surveyId, responseId));
      }
    });
  }

  static surveyGizmoDeletePath(surveyId, responseId) {
    const credentials = `api_token=${process.env.SURVEYGIZMO_REST_API_AUTH_KEY}&api_token_secret=${process.env.SURVEYGIZMO_REST_API_AUTH_SECRET_KEY}`;
    const path = `${process.env.SURVEYGIZMO_REST_API_URL}/survey/${surveyId}/surveyresponse/${responseId}?_method=DELETE&${credentials}`;
    return path;
  }

}

module.exports = MDB;
