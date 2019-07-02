import Giphy from '../services/giphy';
import configuration from '../configuration';
import { generate } from './generator';

const giphy = new Giphy(configuration.api_key);

export const {
  actions,
  reducer
} = generate('trending', (opts) => giphy.trending(opts));
