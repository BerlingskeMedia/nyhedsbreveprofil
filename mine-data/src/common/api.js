import 'whatwg-fetch';

export class Api {
  static getHeaders(body, isPost, authorization) {
    const headers = {};

    if (body && isPost) {
      headers.Accept = 'application/json, text/plain, */*';
      headers['Content-Type'] = 'application/json';
    }

    if (authorization) {
      headers.Authorization = authorization;
    }

    return headers;
  }

  static getUrl(path) {
    return `${process.env.API_URL}${path}`;
  }

  static get(path, authorization) {
    return Api.request(path, {method: 'GET', authorization}).then(r => r.json());
  }

  static post(path, payload, authorization) {
    return Api.request(path, {method: 'POST', payload, authorization});
  }

  static delete(path, authorization) {
    return Api.request(path, {method: 'DELETE', authorization});
  }

  static request(path, {method, payload, headers, authorization}, absoluteUrl = false) {
    const isPost = /^post$/i.test(method);

    return fetch(absoluteUrl ? path : Api.getUrl(path), {
      method,
      body: isPost ? JSON.stringify(payload) : payload,
      headers: Api.getHeaders(payload, isPost, authorization)
    }).then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }

      return response;
    });
  }
}
