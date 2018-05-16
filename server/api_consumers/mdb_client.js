const Http = require('../lib/http');

const MDBAPI_ADDRESS = process.env.MDBAPI_ADDRESS;

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
        name: newsletter.nyhedsbrev_navn,
        time: newsletter.tidspunkt,
        description: newsletter.indhold
      }));

    allData.permission_list = interests
      .filter(permission => profile.permissions.includes(permission.interesse_id))
      .map(permission => ({
        name: permission.interesse_navn,
        time: permission.oprettet,
        description: permission.beskrivelse
      }));

    allData.interesser_list = interests
      .filter(permission => profile.interesser.includes(permission.interesse_id))
      .map(permission => ({
        name: permission.interesse_navn,
        time: permission.oprettet,
        description: permission.beskrivelse
      }));

    return allData;
  }

  static findUser(email) {
    return Http.request('GET', `${MDBAPI_ADDRESS}/users?email=${email}`, null)
      .then(result => result[0]);
  };

  static findSurveyGizmoUser(email) {
    return Http.request('GET', `${MDBAPI_ADDRESS}/surveys?email=${email}`, null);
  };

  static getUserProfile(eksternId) {
    return Http.request('GET', `${MDBAPI_ADDRESS}/users/${eksternId}`, null);
  }

  static getInterests() {
    return Http.request('GET', `${MDBAPI_ADDRESS}/interesser/full`, null);

  }

  static getNewsletters() {
    return Http.request('GET', `${MDBAPI_ADDRESS}/nyhedsbreve`, null);
  }

}

module.exports = MDB;
