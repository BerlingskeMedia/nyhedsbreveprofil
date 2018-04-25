import 'whatwg-fetch';

export class Api {
  static getUrl(path) {
    return `${process.env.API_URL}${path}`;
  }

  static get(path) {
    return fetch(Api.getUrl(path), {
      method: 'GET'
    });
  }
}