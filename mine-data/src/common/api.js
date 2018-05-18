import 'whatwg-fetch';

const littleCache = [];

export class Api {
  static getUrl(path) {
    return `${process.env.API_URL}${path}`;
  }

  static getCached(path) {
    const fromCache = littleCache.find((item) => item.path === path);

    if (fromCache) {
      return fromCache.promise;
    }

    const promise = Api.get(path);
    littleCache.push({path, promise});

    return promise;
  }

  static get(path) {
    return Api.request(path, 'GET').then(r => r.json());
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