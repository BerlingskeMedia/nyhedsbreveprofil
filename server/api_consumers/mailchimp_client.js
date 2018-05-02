const Http = require('../lib/http');
const MAILCHIMP_LISTS = [
  {
    name: 'Memo',
    id: '6b7502c190'
  },
  {
    name: 'Radio24syv Ledergruppe',
    id: '46752206f3'
  },
  {
    name: 'Den Korte Troldehær',
    id: 'd4f8584933'
  },
];
const MAILCHIMP_URI = `https://berlingskemedia:${process.env.MAILCHIMP_API_SECRET}@us3.api.mailchimp.com/3.0`;

class MailChimp {

  static getData(email) {
    return Http.request('GET',
      `${MAILCHIMP_URI}/search-members?query=${email}&exclude_fields=_links,full_search,exact_matches.members._links`,
      null)
      .then(results => MailChimp.getDetails(results.exact_matches.members))
      .then(results => MailChimp.getActivity(results));
  }

  static getDetails(members) {
    return members.map(member => {
      const listItem = MAILCHIMP_LISTS.find(list => list.id === member.list_id);
      return Object.assign({}, member, {list_title: listItem ? listItem.name : ''});
    });
  }

  static getActivity(members) {
    const requests = members.map((member) => {
      return Http.request('GET', `${MAILCHIMP_URI}/lists/${member.list_id}/members/${member.id}/activity?exclude_fields=_links,total_items,list_id,email_id`);
    });

    return Promise.all(requests).then((results) =>
      members.map((member) =>
        Object.assign({}, member, results.shift())
    ));
  }

}

module.exports = MailChimp;
