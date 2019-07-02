import Giphy from '../services/giphy';
import configuration from '../configuration';

const ACTION = {
  FETCH_REQUESTED: 'trending/FETCH_REQUESTED',
  FETCH_SUCCEEDED: 'trending/FETCH_SUCCEEDED',
  FETCH_FAILED: 'trending/FETCH_FAILED',
  RESET: 'trending/RESET'
};

const INITIAL_STATE = {
  offset: 0,
  loading: false,
  error: undefined,
  gifs: []
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ACTION.FETCH_REQUESTED:
    return {
      ...state,
      loading: true,
      error: undefined
    };
  case ACTION.FETCH_FAILED:
    return {
      ...state,
      loading: false,
      error: action.payload.error
    };
  case ACTION.FETCH_SUCCEEDED:
    return {
      ...state,
      loading: false,
      error: undefined,
      gifs: [...state.gifs, ...action.payload.page.data],
      offset: action.payload.offset
    };
  case ACTION.RESET:
    return INITIAL_STATE;
  default:
    return state;
  }
};

const giphy = new Giphy(configuration.api_key);

const setFetchRequested = () => ({
  type: ACTION.FETCH_REQUESTED
});

const setPageLoadFailed = (error) => ({
  type: ACTION.FETCH_FAILED,
  payload: { error }
});

const setPageLoadSucceeded = (page, offset) => ({
  type: ACTION.FETCH_SUCCEEDED,
  payload: { page, offset }
});

const loadNextPage = () => (dispatch, getState) => {
  const { trending } = getState();
  const limit = configuration.page_size;
  const offset = trending.offset + limit;

  dispatch(setFetchRequested());
  return giphy.trending({ offset, limit })
    .then((page) => dispatch(setPageLoadSucceeded(page, offset)))
    .catch((error) => dispatch(setPageLoadFailed(error)));
};

const reset = () => ({ type: ACTION.RESET });

export const actions = {
  loadNextPage,
  reset
};
