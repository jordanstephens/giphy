import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as trending } from './features/trending';
import { reducer as search } from './features/search';

export default (history) => combineReducers({
  trending,
  search,
  router: connectRouter(history)
});
