/*global expect*/
import * as fs from 'fs';
import sinon from 'sinon';
import { generate } from './generator';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);
const fixture = JSON.parse(fs.readFileSync('src/services/fixtures/trending.json'));

describe('generator', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => sandbox.restore());

  it('generates a reducer', () => {
    const fetcher = () => Promise.resolve(fixture);
    const feature = generate('test-prefix', fetcher);

    expect(typeof feature.reducer).toBe('function');
  });

  it('generates loadNextPage and reset actions', () => {
    const fetcher = () => Promise.resolve(fixture);
    const feature = generate('test-prefix', fetcher);

    expect(typeof feature.actions.loadNextPage).toBe('function');
    expect(typeof feature.actions.reset).toBe('function');
  });

  it('generates prefixed action types', () => {
    const fetcher = () => Promise.resolve(fixture);
    const { ACTION } = generate('test-prefix', fetcher);

    expect(ACTION.FETCH_REQUESTED).toEqual('test-prefix/FETCH_REQUESTED');
    expect(ACTION.FETCH_SUCCEEDED).toEqual('test-prefix/FETCH_SUCCEEDED');
    expect(ACTION.FETCH_FAILED).toEqual('test-prefix/FETCH_FAILED');
    expect(ACTION.RESET).toEqual('test-prefix/RESET');
  });

  describe('loadNextPage', () => {
    describe('success', () => {
      let fetcher;

      beforeEach(() => {
        fetcher = () => Promise.resolve(fixture);
      });

      it('dispatches FETCH_REQUESTED and FETCH_SUCCEEDED actions', () => {
        const { ACTION, INITIAL_STATE, actions } = generate('items', fetcher);
        const store = mockStore({ items: INITIAL_STATE });
        return store.dispatch(actions.loadNextPage()).then(() => {
          expect(store.getActions()).toEqual([
            { type: ACTION.FETCH_REQUESTED, payload: { offset: 25 } },
            { type: ACTION.FETCH_SUCCEEDED, payload: { page: fixture } }
          ]);
        });
      });

      it('updates the state via the reducer', () => {
        const { ACTION, INITIAL_STATE, reducer } = generate('items', fetcher);

        const state = reducer(INITIAL_STATE, { type: ACTION.FETCH_SUCCEEDED, payload: { page: fixture } });
        expect(state).toEqual({
          error: undefined,
          loading: false,
          offset: 0,
          gifs: fixture.data
        });
      });

      it('sets loading: true when requesting', () => {
        const { ACTION, INITIAL_STATE, reducer } = generate('items', fetcher);

        const state = reducer(INITIAL_STATE, { type: ACTION.FETCH_REQUESTED, payload: { offset: 25 } });
        expect(state).toEqual({
          error: undefined,
          loading: true,
          offset: 25,
          gifs: []
        });
      });

      it('sets the next offset when requesting', () => {
        const { ACTION, INITIAL_STATE, reducer } = generate('items', fetcher);

        const state = reducer(INITIAL_STATE, { type: ACTION.FETCH_REQUESTED, payload: { offset: 50 } });
        expect(state).toEqual({
          error: undefined,
          loading: true,
          offset: 50,
          gifs: []
        });
      });
    });

    describe('failure', () => {
      let fetcher,
        error;

      beforeEach(() => {
        error = new Error('Uh oh');
        fetcher = () => Promise.reject(error);
      });

      it('dispatches FETCH_REQUESTED and FETCH_FAILED actions', () => {
        const { ACTION, INITIAL_STATE, actions } = generate('items', fetcher);
        const store = mockStore({ items: INITIAL_STATE });
        return store.dispatch(actions.loadNextPage()).then(() => {
          expect(store.getActions()).toEqual([
            { type: ACTION.FETCH_REQUESTED, payload: { offset: 25 } },
            { type: ACTION.FETCH_FAILED, payload: { error } }
          ]);
        });
      });

      it('updates the state via the reducer', () => {
        const { ACTION, INITIAL_STATE, reducer } = generate('items', fetcher);

        const state = reducer(INITIAL_STATE, { type: ACTION.FETCH_FAILED, payload: { error } });
        expect(state).toEqual({
          error,
          loading: false,
          offset: 0,
          gifs: []
        });
      });
    });
  });
});
