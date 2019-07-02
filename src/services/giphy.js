import QueryString from 'query-string';

export default class Giphy {
  constructor(api_key) {
    this.host = 'https://api.giphy.com';
    this.api_key = api_key;
  }

  search(options) {
    return this.get('/v1/gifs/search', options);
  }

  trending(options) {
    return this.get('/v1/gifs/trending', options);
  }

  get(pathname, options) {
    const params = { ...options, api_key: this.api_key };
    const query = QueryString.stringify(Object.keys(params).reduce((acc, k) => {
      acc[k] = encodeURIComponent(params[k]);
      return acc;
    }, {}));
    return window.fetch(`${this.host}${pathname}?${query}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response;
      })
      .then((response) => response.json());
  }
}
