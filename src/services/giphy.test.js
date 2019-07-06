/*global expect*/
import * as fs from 'fs';
import sinon from 'sinon';
import nock from 'nock';
import Giphy from './giphy';
import configuration from '../configuration';

const fixture = JSON.parse(fs.readFileSync('src/services/fixtures/trending.json'));

describe('giphy service', () => {
  let giphy, sandbox;

  beforeEach(() => {
    giphy = new Giphy(configuration.api_key);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe('search', () => {
    describe('success', () => {
      beforeEach(() => {
        nock('https://api.giphy.com')
          .get(new RegExp('/v1/gifs/trending?.*'))
          .reply(200, fixture, { 'access-control-allow-origin': '*' });
        sandbox.spy(window, 'fetch');
      });

      it('makes requests to the giphy api', () => {

        return giphy.trending({}).then(() => {
          expect(window.fetch.calledOnce).toBe(true);
          expect(window.fetch.args[0][0]).toBe('https://api.giphy.com/v1/gifs/trending?api_key=test-api-key');
        });
      });

      it('passes on options as query string params', () => {

        return giphy.trending({ offset: 50, limit: 25 }).then(() => {
          expect(window.fetch.calledOnce).toBe(true);
          expect(window.fetch.args[0][0]).toBe('https://api.giphy.com/v1/gifs/trending?api_key=test-api-key&limit=25&offset=50');
        });
      });

      it('returns a response promise which resolves to page data', () => {

        return giphy.trending({ offset: 50, limit: 25 }).then((response) => {
          expect(response).toEqual(fixture);
        });
      });
    });

    describe('failure', () => {
      beforeEach(() => {
        nock('https://api.giphy.com')
          .get(new RegExp('/v1/gifs/trending?.*'))
          .reply(400, { meta: { msg: 'NOT OK', status: 400 } }, { 'access-control-allow-origin': '*' });
        sandbox.spy(window, 'fetch');
      });

      it('returns a response promise which rejects to an error', () => {
        return giphy.trending({ offset: 50, limit: 25 }).then(() => {
          throw new Error('Expected promise not to resolve');
        }, (error) => {
          expect(error.message).toEqual('Bad Request');
        });
      });
    });
  });
});
