import Giphy from '../services/giphy';
import configuration from '../configuration';

const giphy = new Giphy(configuration.api_key);

const ACTION = {
  FETCH_REQUESTED: 'gif/FETCH_REQUESTED',
  FETCH_SUCCEEDED: 'gif/FETCH_SUCCEEDED',
  FETCH_FAILED: 'gif/FETCH_FAILED',
  RESET: 'gif/RESET'
};

const setFetchRequested = () => ({
  type: ACTION.FETCH_REQUESTED,
});

const setPageLoadFailed = (error) => ({
  type: ACTION.FETCH_FAILED,
  payload: { error }
});

const setPageLoadSucceeded = (gif) => ({
  type: ACTION.FETCH_SUCCEEDED,
  payload: { gif }
});

const loadGif = (id) => (dispatch) => {
  dispatch(setFetchRequested());
  return giphy.gif(id)
    .then((page) => dispatch(setPageLoadSucceeded(page)))
    .catch((error) => dispatch(setPageLoadFailed(error)));
};

const reset = () => ({ type: ACTION.RESET });

export const actions = {
  loadGif,
  reset
};

const INITIAL_STATE = {
  loading: false,
  error: undefined,
  gif: undefined
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ACTION.FETCH_REQUESTED:
    return {
      ...state,
      loading: true,
      error: undefined,
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
      gif: action.payload.gif.data,
    };
  case ACTION.RESET:
    return INITIAL_STATE;
  default:
    return state;
  }
};