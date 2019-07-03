import async from 'async';
import configuration from '../configuration';

const CONCURRENCY = 1;
const queue = async.queue((task, callback) => {
  task().then(
    (...args) => callback(null, ...args),
    (error) => callback(error)
  );
}, CONCURRENCY);


export function generate(prefix, fetcher) {
  const ACTION = {
    FETCH_REQUESTED: `${prefix}/FETCH_REQUESTED`,
    FETCH_SUCCEEDED: `${prefix}/FETCH_SUCCEEDED`,
    FETCH_FAILED: `${prefix}/FETCH_FAILED`,
    RESET: `${prefix}/RESET`
  };

  const setFetchRequested = (offset) => ({
    type: ACTION.FETCH_REQUESTED,
    payload: { offset }
  });

  const setPageLoadFailed = (error) => ({
    type: ACTION.FETCH_FAILED,
    payload: { error }
  });

  const setPageLoadSucceeded = (page) => ({
    type: ACTION.FETCH_SUCCEEDED,
    payload: { page }
  });

  const loadNextPage = (options = {}) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const task = () => {
        const limit = configuration.page_size;
        const state = getState();
        const offset = state[prefix].offset;
        dispatch(setFetchRequested(offset + limit));
        return fetcher({ ...options, offset, limit })
          .then((page) => dispatch(setPageLoadSucceeded(page)))
          .catch((error) => dispatch(setPageLoadFailed(error)));
      };

      queue.push(task, (error, action) => {
        if (error) return reject(error);
        resolve(action);
      });
    });
  };

  const reset = () => ({ type: ACTION.RESET });

  const INITIAL_STATE = {
    offset: 0,
    loading: false,
    error: undefined,
    gifs: []
  };

  const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case ACTION.FETCH_REQUESTED:
      return {
        ...state,
        loading: true,
        error: undefined,
        offset: state.offset + action.payload.offset,
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
      };
    case ACTION.RESET:
      return INITIAL_STATE;
    default:
      return state;
    }
  };

  return {
    ACTION,
    INITIAL_STATE,
    reducer,
    actions: {
      loadNextPage,
      reset
    }
  };
}
