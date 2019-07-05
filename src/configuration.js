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
  grid_gutter_px: 10,
  grid_column_width_px: 200,
  grid_padding_px: 20,
  overscan_px: 0,
  colors: ['rgb(0, 255, 153)', 'rgb(0, 204, 255)', 'rgb(153, 251, 255)', 'rgb(255, 102, 102)', 'rgb(255, 243, 92)']
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
