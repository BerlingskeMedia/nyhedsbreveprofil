import 'whatwg-fetch';

export class Api {
  static getUrl(path) {
    return `${process.env.API_URL}${path}`;
  }

  static get(path) {
    return Api.request(path, 'GET');
  }

  static post(path, payload) {
    return Api.request(path, 'POST', payload);
  }

  static request(path, method, body) {
    const isPost = /^post$/i.test(method);

    return fetch(Api.getUrl(path), {
      method,
      body: isPost ? JSON.stringify(body) : body,
      headers: body && isPost ? {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      } : {}
    }).then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }

      return response;
    });
  }
}