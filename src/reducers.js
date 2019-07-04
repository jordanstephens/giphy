import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as trending } from './features/trending';
import { reducer as search } from './features/search';
import { reducer as gif } from './features/gif';

export default (history) => combineReducers({
  trending,
  search,
  gif,
  router: connectRouter(history)
});
