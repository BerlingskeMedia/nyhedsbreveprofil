import 'whatwg-fetch';

const littleCache = [];
const cacheTime = 1000;

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

  static getCached(path, authorization) {
    const now = Date.now();
    const fromCache = littleCache.find((item) => item.path === path && now < item.expires);

    if (fromCache) {
      return fromCache.promise;
    }

    const promise = Api.get(path, authorization);
    const expires = Date.now() + cacheTime;
    littleCache.push({path, promise, expires});

    return promise;
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