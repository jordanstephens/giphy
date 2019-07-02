import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as trendingReducer } from './features/trending';

export default (history) => combineReducers({
  trending: trendingReducer,
  router: connectRouter(history)
});
