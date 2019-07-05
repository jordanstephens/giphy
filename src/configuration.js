/*global process*/

const configuration = {
  api_key: {
    development: process.env.REACT_APP_API_KEY,
    test: 'test-api-key',
    production: process.env.REACT_APP_API_KEY
  },
  page_size: 25,
  // I had a really hard time naming this, but this is how we derive
  // the distance from the bottom of the page at which we request the
  // next page of content. We take this fraction of the window height
  // and use that as the scroll threshold.
  page_bumper_ratio: 0.2,
  overscan_px: 0,
};

const environments = ['development', 'test', 'production'];

function resolve(definition) {
  return Object.keys(definition).reduce((acc, k) => {
    const short = !environments.some((env) => definition[k].hasOwnProperty(env));
    const value = short ? definition[k] : definition[k][process.env.NODE_ENV];
    acc[k] = value;
    return acc;
  }, {});
}

export default resolve(configuration);
